'use client';

import type { CaseType } from '@/data/land-permit';
import type { Answers } from '../types/answers';
import type { ChatMessage } from '../types/message';
import {
  encryptJson,
  decryptJson,
  isEncryptedEnvelope,
  clearEncKey,
  isCryptoAvailable,
} from './crypto-store';

export type ChatStatus =
  | 'idle'
  | 'sending'
  | 'asking'
  | 'completing'
  | 'previewing'
  | 'reviewing'
  | 'error';

export interface ChatState {
  caseType: CaseType | null;
  messages: ChatMessage[];
  answers: Answers;
  missingFields: string[];
  status: ChatStatus;
  error: string | null;
  isComplete: boolean;
}

export const initialChatState: ChatState = {
  caseType: null,
  messages: [],
  answers: {},
  missingFields: [],
  status: 'idle',
  error: null,
  isComplete: false,
};

export type ChatAction =
  | { type: 'SELECT_CASE'; caseType: CaseType; greeting: ChatMessage }
  | { type: 'SEND_START'; userMessage: ChatMessage }
  | {
      type: 'SEND_SUCCESS';
      assistantMessage: ChatMessage;
      mergedAnswers: Answers;
      missingFields: string[];
      isComplete: boolean;
    }
  | { type: 'SEND_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'OPEN_PREVIEW' }
  | { type: 'CLOSE_PREVIEW' }
  | { type: 'OPEN_REVIEW' }
  | { type: 'CLOSE_REVIEW' }
  | { type: 'PATCH_ANSWERS'; answers: Answers; missingFields: string[]; isComplete: boolean }
  | { type: 'RESET' }
  | {
      type: 'HYDRATE_FROM_URL';
      caseType: CaseType;
      answers: Answers;
      missingFields: string[];
      isComplete: boolean;
      messages: ChatMessage[];
      fromShare?: boolean;
    };

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SELECT_CASE':
      return {
        ...initialChatState,
        caseType: action.caseType,
        messages: [action.greeting],
        status: 'asking',
      };
    case 'SEND_START':
      return {
        ...state,
        messages: [...state.messages, action.userMessage],
        status: 'sending',
        error: null,
      };
    case 'SEND_SUCCESS':
      return {
        ...state,
        messages: [...state.messages, action.assistantMessage],
        answers: action.mergedAnswers,
        missingFields: action.missingFields,
        isComplete: action.isComplete,
        status: action.isComplete ? 'completing' : 'asking',
        error: null,
      };
    case 'SEND_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.error,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null, status: state.isComplete ? 'completing' : 'asking' };
    case 'OPEN_PREVIEW':
      return { ...state, status: 'previewing' };
    case 'CLOSE_PREVIEW':
      return {
        ...state,
        status: state.isComplete ? 'completing' : 'asking',
      };
    case 'OPEN_REVIEW':
      return { ...state, status: 'reviewing' };
    case 'CLOSE_REVIEW':
      return {
        ...state,
        status: state.isComplete ? 'completing' : 'asking',
      };
    case 'PATCH_ANSWERS':
      return {
        ...state,
        answers: action.answers,
        missingFields: action.missingFields,
        isComplete: action.isComplete,
      };
    case 'RESET':
      return initialChatState;
    case 'HYDRATE_FROM_URL':
      return {
        ...initialChatState,
        caseType: action.caseType,
        answers: action.answers,
        missingFields: action.missingFields,
        isComplete: action.isComplete,
        messages: action.messages,
        status: action.fromShare
          ? 'reviewing'
          : action.isComplete
            ? 'completing'
            : 'asking',
      };
    default:
      return state;
  }
}

const STORAGE_KEY = 'gangnam-realty:land-permit-ai:session:v1';

interface PersistedSession {
  caseType: CaseType | null;
  answers: Answers;
  missingFields: string[];
  isComplete: boolean;
  messages: ChatMessage[];
}

function maskRrnInString(value: string): string {
  return value
    .replace(/(\d{6})-(\d{7})/g, (_m, p1) => `${p1}-*******`)
    .replace(/\b(\d{6})(\d{7})\b/g, (_m, p1) => `${p1}-*******`);
}

function maskRrnDeep(value: unknown): unknown {
  if (typeof value === 'string') return maskRrnInString(value);
  if (Array.isArray(value)) return value.map(maskRrnDeep);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = maskRrnDeep(v);
    }
    return out;
  }
  return value;
}

function buildMaskedPayload(state: ChatState): PersistedSession {
  return {
    caseType: state.caseType,
    answers: maskRrnDeep(state.answers) as Answers,
    missingFields: state.missingFields,
    isComplete: state.isComplete,
    messages: state.messages.map((m) => ({
      ...m,
      content: maskRrnInString(m.content),
    })),
  };
}

function isPersistedSession(value: unknown): value is PersistedSession {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    'caseType' in v &&
    'answers' in v &&
    'missingFields' in v &&
    'isComplete' in v &&
    'messages' in v
  );
}

export async function persistSession(state: ChatState): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    // mask → encrypt order is mandatory (PII masking precedes encryption envelope)
    const masked = buildMaskedPayload(state);
    if (isCryptoAvailable()) {
      const env = await encryptJson(masked);
      if (env) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(env));
        return;
      }
    }
    // fallback: plaintext (non-secure context, etc.) — still masked
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(masked));
  } catch {
    /* storage may be unavailable */
  }
}

export async function loadSession(): Promise<PersistedSession | null> {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (isEncryptedEnvelope(parsed)) {
      const dec = await decryptJson<PersistedSession>(parsed);
      if (!dec || !isPersistedSession(dec)) return null;
      return dec;
    }
    // legacy plaintext — migrate by re-encrypting in place
    if (!isPersistedSession(parsed)) return null;
    if (isCryptoAvailable()) {
      const env = await encryptJson(parsed);
      if (env) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(env));
        } catch {
          /* migration write failure is non-fatal */
        }
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  clearEncKey();
}

export { maskRrnInString };
