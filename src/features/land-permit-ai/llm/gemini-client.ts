import { GoogleGenAI, type Content } from '@google/genai';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface CallGeminiParams {
  systemInstruction: string;
  history: ChatTurn[];
  userMessage: string;
  responseJsonSchema: unknown;
  signal?: AbortSignal;
}

export interface CallGeminiResult {
  text: string;
}

let cachedClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}

function toGeminiContents(history: ChatTurn[], userMessage: string): Content[] {
  const out: Content[] = [];
  for (const turn of history) {
    out.push({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.content }],
    });
  }
  out.push({ role: 'user', parts: [{ text: userMessage }] });
  return out;
}

export async function callGemini(params: CallGeminiParams): Promise<CallGeminiResult> {
  const client = getClient();
  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: toGeminiContents(params.history, params.userMessage),
    config: {
      systemInstruction: params.systemInstruction,
      responseMimeType: 'application/json',
      responseJsonSchema: params.responseJsonSchema,
      temperature: 0.2,
      maxOutputTokens: 2048,
      abortSignal: params.signal,
    },
  });

  const text = response.text;
  if (!text || typeof text !== 'string') {
    throw new Error('GEMINI_EMPTY_RESPONSE');
  }
  return { text };
}
