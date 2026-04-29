'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { CaseType } from '@/data/land-permit';
import { caseDefinitions } from '@/data/land-permit';
import type { ProviderBundle } from '../types/providers';
import { ProviderContextProvider } from '../providers/ProviderContext';
import {
  chatReducer,
  initialChatState,
  loadSession,
  persistSession,
  clearSession,
  maskRrnInString,
  type ChatState,
} from '../state/store';
import type { ChatMessage } from '../types/message';
import { computeMissingFields, getRequiredPaths } from '../llm/required-paths';
import { decodeShareToken, readHashToken, clearHashToken } from '../share/decode';
import { createId } from '../utils/id';
import { ChatHeader } from './v2/ChatHeader';
import { ChatTimeline } from './v2/ChatTimeline';
import { Composer } from './v2/Composer';
import { LivePreviewPane } from './v2/LivePreviewPane';
import { LpSidebar, type LpSession } from './v2/LpSidebar';
import { NoticeBanner } from './v2/NoticeBanner';
import { ResultReport } from './v2/ResultReport';
import { ErrorBanner } from './ErrorBanner';
import { QrShareDialog } from './QrShareDialog';
import { deriveSlots, FIELD_LABEL } from './v2/cards/derive-slots';
import type { AutoLookupMeta, RichSlot } from './v2/cards/types';

export interface ChatRootProps {
  providers?: Partial<ProviderBundle>;
}

interface ChatApiSuccess {
  ok: true;
  assistantMessage: string;
  extractedFields: unknown;
  mergedAnswers: Record<string, unknown>;
  missingFields: string[];
  isComplete: boolean;
  confidence?: Record<string, 'high' | 'medium' | 'low'>;
  askFields?: string[];
  autoLookup?: AutoLookupMeta;
}

interface ChatApiError {
  ok: false;
  message: string;
}

type ChatApiResponse = ChatApiSuccess | ChatApiError;

const SUGGESTION_CHIPS = [
  '필요한 서류가 뭐예요?',
  '자금조달계획서 도와줘',
  '처리 기간은 얼마나 걸려요?',
];

function buildGreeting(caseType: CaseType): ChatMessage {
  const def = caseDefinitions.find((c) => c.type === caseType);
  const label = def?.label ?? '신청';
  const text =
    `안녕하세요. ${label} 케이스로 토지거래허가 서류를 준비해드릴게요.\n` +
    '편하게 한국어로 알려주시면 됩니다. 예: "매수인 이름은 이지은이고 연락처는 010-9876-5432예요. 토지는 강남구 압구정동 123-45번지입니다."\n' +
    '여러 정보를 한 번에 말씀해주셔도 좋아요. 시작해볼까요?';
  return {
    id: createId('a'),
    role: 'assistant',
    content: text,
    timestamp: Date.now(),
    slots: [{ kind: 'text' }],
  };
}

export function ChatRoot({ providers }: ChatRootProps) {
  return (
    <ProviderContextProvider providers={providers}>
      <ChatRootInner />
    </ProviderContextProvider>
  );
}

function ChatRootInner() {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const [input, setInput] = useState('');
  const [confidence, setConfidence] = useState<Record<string, 'high' | 'medium' | 'low'> | undefined>();
  const [autoLookup, setAutoLookup] = useState<AutoLookupMeta | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sharedNotice, setSharedNotice] = useState(false);
  const [sessions] = useState<LpSession[]>([]);
  // SSR-safe: false 초기값 → mount 후 matchMedia 결과 반영. 모바일 회귀 0.
  const [isWidePreview, setIsWidePreview] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsWidePreview(mql.matches);
    update();
    if (mql.addEventListener) {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }
    // older safari fallback
    mql.addListener(update);
    return () => mql.removeListener(update);
  }, []);
  const lastUserMessageRef = useRef<string>('');
  const prevProgressRef = useRef<number>(0);
  const lastStepEmittedRef = useRef<number>(-1);

  // Hydrate from URL hash, then localStorage
  useEffect(() => {
    if (hydrated) return;
    setHydrated(true);
    if (typeof window === 'undefined') return;
    void (async () => {
      const token = readHashToken();
      if (token) {
        const decoded = decodeShareToken(token);
        if (decoded && decoded.caseType) {
          const missing = computeMissingFields(
            decoded.caseType,
            decoded.answers as Record<string, unknown>,
          );
          const greeting = buildGreeting(decoded.caseType);
          dispatch({
            type: 'HYDRATE_FROM_URL',
            caseType: decoded.caseType,
            answers: decoded.answers,
            missingFields: missing,
            isComplete: missing.length === 0,
            messages: [greeting],
            fromShare: true,
          });
          clearHashToken();
          setSharedNotice(true);
          return;
        }
        clearHashToken();
      }
      const persisted = await loadSession();
      if (persisted && persisted.caseType) {
        dispatch({
          type: 'HYDRATE_FROM_URL',
          caseType: persisted.caseType,
          answers: persisted.answers,
          missingFields: persisted.missingFields,
          isComplete: persisted.isComplete,
          messages:
            persisted.messages.length > 0
              ? persisted.messages
              : [buildGreeting(persisted.caseType)],
        });
      }
    })();
  }, [hydrated]);

  // Persist on every meaningful change
  useEffect(() => {
    if (!hydrated) return;
    if (state.caseType) void persistSession(state);
  }, [state, hydrated]);

  const selectCase = useCallback((caseType: CaseType) => {
    dispatch({ type: 'SELECT_CASE', caseType, greeting: buildGreeting(caseType) });
    setConfidence(undefined);
    setAutoLookup(null);
    prevProgressRef.current = 0;
    lastStepEmittedRef.current = -1;
  }, []);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed) return;
      if (!state.caseType) return;
      if (state.status === 'sending') return;

      const sanitized = maskRrnInString(trimmed);
      lastUserMessageRef.current = sanitized;

      const userMsg: ChatMessage = {
        id: createId('u'),
        role: 'user',
        content: sanitized,
        timestamp: Date.now(),
      };

      dispatch({ type: 'SEND_START', userMessage: userMsg });
      setInput('');
      setSharedNotice(false);

      const history = state.messages.map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseType: state.caseType,
            history,
            currentAnswers: state.answers,
            userMessage: sanitized,
          }),
        });

        let data: ChatApiResponse;
        try {
          data = (await res.json()) as ChatApiResponse;
        } catch {
          dispatch({
            type: 'SEND_ERROR',
            error: '서버 응답을 읽을 수 없습니다. 잠시 후 다시 시도해주세요.',
          });
          return;
        }

        if (!res.ok || !data.ok) {
          const message =
            data && 'message' in data && data.message
              ? data.message
              : 'AI 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.';
          dispatch({ type: 'SEND_ERROR', error: message });
          return;
        }

        const totalRequired = state.caseType ? getRequiredPaths(state.caseType).length : 0;
        const progress = totalRequired === 0 ? 0 : 1 - data.missingFields.length / totalRequired;
        const prevProgress = prevProgressRef.current;
        const stepBucket = Math.floor(progress * 4);
        const shouldEmitStep =
          stepBucket !== lastStepEmittedRef.current &&
          (data.missingFields.length === 0 ||
            Math.abs(progress - prevProgress) >= 0.2 ||
            prevProgress === 0);

        const slots: RichSlot[] = deriveSlots(
          {
            text: data.assistantMessage,
            autoLookup: data.autoLookup ?? null,
            missingFields: data.missingFields,
            askFields: data.askFields,
            isComplete: data.isComplete,
            caseType: state.caseType,
            answers: data.mergedAnswers,
            totalRequiredCount: totalRequired,
            prevProgress,
          },
          { forcePushStep: shouldEmitStep },
        );

        if (shouldEmitStep) {
          lastStepEmittedRef.current = stepBucket;
        }
        prevProgressRef.current = progress;

        const assistantMsg: ChatMessage = {
          id: createId('a'),
          role: 'assistant',
          content: data.assistantMessage,
          timestamp: Date.now(),
          slots,
          meta: {
            autoLookup: data.autoLookup ?? null,
            confidence: data.confidence,
            progress,
          },
        };
        dispatch({
          type: 'SEND_SUCCESS',
          assistantMessage: assistantMsg,
          mergedAnswers: data.mergedAnswers,
          missingFields: data.missingFields,
          isComplete: data.isComplete,
        });
        if (data.confidence) setConfidence(data.confidence);
        if (data.autoLookup) {
          setAutoLookup(data.autoLookup);
        } else {
          setAutoLookup(null);
        }
      } catch {
        dispatch({
          type: 'SEND_ERROR',
          error: '네트워크 오류로 메시지를 전송하지 못했습니다.',
        });
      }
    },
    [state.answers, state.caseType, state.messages, state.status],
  );

  // Suppress unused warnings while keeping the values reachable for future hooks
  void confidence;
  void autoLookup;

  const handleRetry = () => {
    if (lastUserMessageRef.current) {
      void sendMessage(lastUserMessageRef.current);
    } else {
      dispatch({ type: 'CLEAR_ERROR' });
    }
  };

  const handleReset = () => {
    clearSession();
    dispatch({ type: 'RESET' });
    setConfidence(undefined);
    setInput('');
    setAutoLookup(null);
    setDrawerOpen(false);
    setSharedNotice(false);
    prevProgressRef.current = 0;
    lastStepEmittedRef.current = -1;
  };

  const handleDeleteAll = () => {
    if (typeof window === 'undefined') return;
    const ok = window.confirm(
      '저장된 모든 대화/생성 내역을 삭제할까요? 되돌릴 수 없습니다.',
    );
    if (!ok) return;
    clearSession();
    dispatch({ type: 'RESET' });
    setConfidence(undefined);
    setAutoLookup(null);
    setInput('');
    setSharedNotice(false);
    setDrawerOpen(false);
    prevProgressRef.current = 0;
    lastStepEmittedRef.current = -1;
  };

  function formatFormValue(path: string, raw: string): string {
    if (path.startsWith('privacy.consent')) {
      return raw === 'true' ? '동의함' : '동의하지 않음';
    }
    if (
      path === 'landUseSelf.hasExistingHouse' ||
      path === 'landUseTax.sellerIsMultiHouseOwner' ||
      path === 'landUseTax.buyerIsNoHouse'
    ) {
      return raw === 'true' ? '예' : '아니오';
    }
    return raw.trim();
  }

  function handleSubmitFormFields(values: Record<string, string>) {
    const lines = Object.entries(values)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([path, raw]) => {
        const label = FIELD_LABEL[path] ?? path;
        const value = formatFormValue(path, raw);
        return `${label}: ${value}`;
      });
    if (lines.length === 0) return;
    void sendMessage(lines.join('\n'));
  }

  const isTyping = state.status === 'sending';
  const isReviewing = state.status === 'reviewing';

  return (
    <div
      style={{
        display: 'flex',
        height: '100dvh',
        background: 'var(--paper)',
        overflow: 'hidden',
      }}
    >
      <LpSidebar
        sessions={sessions}
        onNew={handleReset}
        onDelete={handleDeleteAll}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          minWidth: 0,
          height: '100%',
        }}
        className="lp-chat-with-preview"
      >
      <main
        style={{
          flex: isWidePreview && state.caseType && !isReviewing ? '1 1 60%' : 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <ChatHeader onMenuClick={() => setDrawerOpen(true)} ready={!isTyping} />
        <NoticeBanner />

        {isReviewing && state.caseType ? (
          <ResultReport
            caseType={state.caseType}
            answers={state.answers}
            isComplete={state.isComplete}
            missingCount={state.missingFields.length}
            sharedNotice={sharedNotice}
            onClose={() => {
              setSharedNotice(false);
              dispatch({ type: 'CLOSE_REVIEW' });
            }}
            onShareQr={() => setQrOpen(true)}
          />
        ) : (
          <>
            <ChatTimeline
              messages={state.messages}
              caseType={state.caseType}
              answers={state.answers}
              isTyping={isTyping}
              onSelectCase={selectCase}
              onSubmitFormFields={handleSubmitFormFields}
              onOpenReview={() => dispatch({ type: 'OPEN_REVIEW' })}
              trailingSlot={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {state.error ? (
                    <ErrorBanner
                      message={state.error}
                      onRetry={handleRetry}
                      onDismiss={() => dispatch({ type: 'CLEAR_ERROR' })}
                    />
                  ) : null}
                  {state.isComplete && state.caseType ? (
                    <div
                      style={{
                        background: 'var(--ok-soft)',
                        border: '1px solid oklch(78% 0.12 155 / 0.4)',
                        borderRadius: 12,
                        padding: '12px 14px',
                        display: 'flex',
                        gap: 10,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ fontSize: 13, color: 'oklch(28% 0.1 155)', fontWeight: 500 }}>
                        모든 필수 항목이 채워졌어요. 검토 결과를 열어 PDF를 받아가세요.
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ padding: '8px 14px', fontSize: 13 }}
                        onClick={() => dispatch({ type: 'OPEN_REVIEW' })}
                      >
                        검토 결과 열기
                      </button>
                    </div>
                  ) : null}
                </div>
              }
            />
            {state.caseType ? (
              <Composer
                value={input}
                onChange={setInput}
                onSubmit={(text) => void sendMessage(text)}
                suggestions={SUGGESTION_CHIPS}
                disabled={isTyping}
              />
            ) : null}
          </>
        )}
      </main>
        {isWidePreview && state.caseType && !isReviewing ? (
          <div
            className="lp-preview-wrap"
            style={{
              flex: '0 0 40%',
              minWidth: 0,
              display: 'flex',
              borderLeft: '1px solid var(--line-2)',
              height: '100%',
            }}
          >
            <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
              <LivePreviewPane caseType={state.caseType} answers={state.answers} />
            </div>
          </div>
        ) : null}
      </div>

      <QrShareDialog
        open={qrOpen}
        caseType={state.caseType}
        answers={state.answers}
        onClose={() => setQrOpen(false)}
      />
    </div>
  );
}

export type { ChatState };
