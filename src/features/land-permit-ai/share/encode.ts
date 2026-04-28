import { compressToEncodedURIComponent } from 'lz-string';
import type { CaseType } from '@/data/land-permit';
import type { Answers } from '../types/answers';
import { SCHEMA_PREFIX, URL_LENGTH_LIMIT } from './schema-version';

export interface EncodePayload {
  caseType: CaseType | null;
  answers: Answers;
}

const CRITICAL_TARGETS = [
  'application.sellerName',
  'application.buyerName',
  'application.landAddress',
  'application.landLotNumber',
  'application.landCategory',
  'application.landArea',
  'application.landZone',
  'application.contractAmount',
  'application.rightType',
];

function pickCriticalAnswers(answers: Answers): Answers {
  const out: Record<string, unknown> = {};
  const root = answers as Record<string, unknown>;
  for (const path of CRITICAL_TARGETS) {
    const segs = path.split('.');
    let cur: unknown = root;
    for (const s of segs) {
      if (cur == null || typeof cur !== 'object') {
        cur = undefined;
        break;
      }
      cur = (cur as Record<string, unknown>)[s];
    }
    if (cur != null) {
      const [bucket, key] = segs;
      const bucketObj = (out[bucket] as Record<string, unknown> | undefined) ?? {};
      bucketObj[key] = cur;
      out[bucket] = bucketObj;
    }
  }
  return out as Answers;
}

export function encodeShareToken(payload: EncodePayload): string {
  const json = JSON.stringify(payload);
  const compressed = compressToEncodedURIComponent(json);
  const token = `${SCHEMA_PREFIX}${compressed}`;
  if (token.length <= URL_LENGTH_LIMIT) return token;
  const minimal: EncodePayload = {
    caseType: payload.caseType,
    answers: pickCriticalAnswers(payload.answers),
  };
  const minimalJson = JSON.stringify(minimal);
  const minimalCompressed = compressToEncodedURIComponent(minimalJson);
  return `${SCHEMA_PREFIX}${minimalCompressed}`;
}

export function buildShareUrl(token: string, base?: string): string {
  if (typeof window === 'undefined') {
    return base ? `${base}#s=${token}` : `#s=${token}`;
  }
  const origin = base ?? window.location.origin + window.location.pathname;
  return `${origin}#s=${token}`;
}
