import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { CaseType } from '@/data/land-permit';
import { buildResponseSchemaForCase } from '@/features/land-permit-ai/llm/schemas';
import { buildSystemPrompt } from '@/features/land-permit-ai/llm/system-prompt';
import { callGemini, type ChatTurn } from '@/features/land-permit-ai/llm/gemini-client';
import { mergeExtractedFields } from '@/features/land-permit-ai/llm/merge';
import { computeMissingFields } from '@/features/land-permit-ai/llm/required-paths';
import { applyAutoLandLookup } from '@/features/land-permit-ai/llm/auto-lookup';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const zCaseType = z.enum(['self-occupy', 'non-residential', 'tax-deferral', 'proxy']);

const zChatTurn = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(8000),
});

const zRequestBody = z.object({
  caseType: zCaseType,
  history: z.array(zChatTurn).max(40),
  currentAnswers: z.record(z.string(), z.unknown()),
  userMessage: z.string().min(1).max(4000),
});

interface ApiSuccess {
  ok: true;
  assistantMessage: string;
  extractedFields: unknown;
  mergedAnswers: Record<string, unknown>;
  missingFields: string[];
  isComplete: boolean;
  confidence?: Record<string, 'high' | 'medium' | 'low'>;
  askFields?: string[];
  autoLookup?: {
    applied: boolean;
    source: 'vworld' | 'mock' | 'skipped' | 'failed';
    filled: Array<'landCategory' | 'landArea' | 'landZone'>;
    note?: string;
  };
}

interface ApiError {
  ok: false;
  message: string;
}

function errorResponse(status: number, message: string): NextResponse<ApiError> {
  return NextResponse.json<ApiError>({ ok: false, message }, { status });
}

function tryParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenced) {
      try {
        return JSON.parse(fenced[1]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiSuccess | ApiError>> {
  if (!process.env.GEMINI_API_KEY) {
    return errorResponse(503, 'AI 서비스 설정이 필요합니다. 운영자에게 문의해주세요.');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, '요청 형식이 올바르지 않습니다.');
  }

  const parsed = zRequestBody.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, '요청 데이터가 올바르지 않습니다. 새로고침 후 다시 시도해주세요.');
  }

  const { caseType, history, currentAnswers, userMessage } = parsed.data;

  const responseZodSchema = buildResponseSchemaForCase(caseType as CaseType);
  const responseJsonSchema = z.toJSONSchema(responseZodSchema, {
    target: 'draft-7',
  });

  const initialMissing = computeMissingFields(caseType as CaseType, currentAnswers);
  const baseSystemPrompt = buildSystemPrompt(
    caseType as CaseType,
    currentAnswers,
    initialMissing,
  );

  const turns: ChatTurn[] = history.map((t) => ({ role: t.role, content: t.content }));

  async function attemptOnce(systemInstruction: string) {
    const { text } = await callGemini({
      systemInstruction,
      history: turns,
      userMessage,
      responseJsonSchema,
    });
    const json = tryParseJson(text);
    if (!json) return { error: 'parse' as const };
    const validated = responseZodSchema.safeParse(json);
    if (!validated.success) return { error: 'schema' as const };
    return { error: null, data: validated.data };
  }

  let result: Awaited<ReturnType<typeof attemptOnce>>;
  try {
    result = await attemptOnce(baseSystemPrompt);
    if (result.error) {
      const retryPrompt =
        baseSystemPrompt +
        '\n\n중요: 이전 응답이 JSON 스키마를 따르지 않았습니다. 반드시 지정된 스키마에 정확히 일치하는 JSON 한 개만 반환하세요.';
      result = await attemptOnce(retryPrompt);
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'GEMINI_API_KEY_MISSING') {
      return errorResponse(503, 'AI 서비스 설정이 필요합니다.');
    }
    return errorResponse(502, 'AI 응답을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }

  if (result.error || !result.data) {
    return errorResponse(
      502,
      'AI 응답 형식이 일시적으로 잘못되었습니다. 다시 한 번 입력해주세요.',
    );
  }

  const mergedAnswers = mergeExtractedFields(currentAnswers, result.data.extractedFields);
  const { merged: finalMerged, autoLookup } = await applyAutoLandLookup(
    mergedAnswers,
    result.data.confidence,
  );
  const missingFields = computeMissingFields(caseType as CaseType, finalMerged);
  const isComplete = missingFields.length === 0;

  return NextResponse.json<ApiSuccess>({
    ok: true,
    assistantMessage: result.data.assistantMessage,
    extractedFields: result.data.extractedFields,
    mergedAnswers: finalMerged as Record<string, unknown>,
    missingFields,
    isComplete,
    confidence: result.data.confidence,
    askFields: result.data.askFields,
    autoLookup,
  });
}
