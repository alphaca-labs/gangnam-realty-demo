import { decompressFromEncodedURIComponent } from 'lz-string';
import type { CaseType } from '@/data/land-permit';
import type { Answers } from '../types/answers';
import { SCHEMA_PREFIX } from './schema-version';

export interface DecodedShare {
  caseType: CaseType | null;
  answers: Answers;
}

const VALID_CASE_TYPES: CaseType[] = ['self-occupy', 'non-residential', 'tax-deferral', 'proxy'];

export function decodeShareToken(token: string): DecodedShare | null {
  if (!token) return null;
  if (!token.startsWith(SCHEMA_PREFIX)) return null;
  const compressed = token.slice(SCHEMA_PREFIX.length);
  let json: string | null;
  try {
    json = decompressFromEncodedURIComponent(compressed);
  } catch {
    return null;
  }
  if (!json) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const obj = parsed as { caseType?: unknown; answers?: unknown };
  let caseType: CaseType | null = null;
  if (typeof obj.caseType === 'string' && VALID_CASE_TYPES.includes(obj.caseType as CaseType)) {
    caseType = obj.caseType as CaseType;
  }
  const answers = obj.answers && typeof obj.answers === 'object' ? (obj.answers as Answers) : {};
  return { caseType, answers };
}

export function readHashToken(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash) return null;
  const match = hash.match(/[#&]s=([^&]+)/);
  return match ? match[1] : null;
}

export function clearHashToken(): void {
  if (typeof window === 'undefined') return;
  if (window.history && window.history.replaceState) {
    const url = window.location.pathname + window.location.search;
    window.history.replaceState(null, '', url);
  } else {
    window.location.hash = '';
  }
}
