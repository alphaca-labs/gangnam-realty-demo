import type { Answers } from '../types/answers';
import type { ExtractedFields } from './schemas/response.schema';

const KNOWN_BUCKETS = [
  'application',
  'landUseSelf',
  'landUseOther',
  'landUseTax',
  'funding',
  'privacy',
  'proxy',
] as const;

type Bucket = (typeof KNOWN_BUCKETS)[number];

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function mergeBucket(
  existing: unknown,
  incoming: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const base = isPlainObject(existing) ? { ...existing } : {};
  if (!incoming) return base;
  for (const key of Object.keys(incoming)) {
    const val = incoming[key];
    if (val === undefined || val === null) continue;
    if (typeof val === 'string' && val.trim() === '') continue;
    base[key] = val;
  }
  return base;
}

export function mergeExtractedFields(
  current: Answers,
  extracted: ExtractedFields | undefined,
): Answers {
  if (!extracted) return current;
  const next: Record<string, unknown> = { ...(current as Record<string, unknown>) };
  for (const bucket of KNOWN_BUCKETS) {
    const incoming = (extracted as Record<Bucket, Record<string, unknown> | undefined>)[bucket];
    if (!incoming) continue;
    next[bucket] = mergeBucket(next[bucket], incoming);
  }
  return next;
}
