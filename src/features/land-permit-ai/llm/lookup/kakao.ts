import 'server-only';
import { z } from 'zod';
import type { KakaoAddressResult } from './types';

const KAKAO_TIMEOUT_MS = 1500;
const KAKAO_ENDPOINT = 'https://dapi.kakao.com/v2/local/search/address.json';

export function getKakaoApiKey(): string | undefined {
  const v = process.env.KAKAO_REST_API_KEY;
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

const zKakaoAddressDoc = z
  .object({
    address_name: z.string().optional(),
    b_code: z.string().optional(),
    main_address_no: z.string().optional(),
    sub_address_no: z.string().optional(),
  })
  .passthrough();

const zKakaoDocument = z
  .object({
    address_name: z.string().optional(),
    address: zKakaoAddressDoc.nullable().optional(),
    road_address: z
      .object({
        address_name: z.string().optional(),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough();

const zKakaoResponse = z
  .object({
    documents: z.array(zKakaoDocument).default([]),
    meta: z.object({ total_count: z.number().optional() }).passthrough().optional(),
  })
  .passthrough();

function parseIntSafe(s: string | undefined | null): number | null {
  if (s == null) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

export async function fetchKakaoAddress(
  query: string,
  apiKey: string,
  externalSignal?: AbortSignal,
): Promise<KakaoAddressResult | null> {
  if (!apiKey) return null;
  if (!query || !query.trim()) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), KAKAO_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', onAbort);
  }

  try {
    const url = `${KAKAO_ENDPOINT}?query=${encodeURIComponent(query.trim())}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `KakaoAK ${apiKey}` },
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    let json: unknown;
    try {
      json = await res.json();
    } catch {
      return null;
    }
    const parsed = zKakaoResponse.safeParse(json);
    if (!parsed.success) return null;
    const docs = parsed.data.documents;
    if (!docs || docs.length === 0) return null;

    for (const doc of docs) {
      const addr = doc.address;
      if (!addr) continue;
      const bCode = (addr.b_code ?? '').trim();
      const mainNo = parseIntSafe(addr.main_address_no);
      const subNo = parseIntSafe(addr.sub_address_no) ?? 0;
      if (bCode.length !== 10 || !/^\d{10}$/.test(bCode)) continue;
      if (mainNo == null) continue;
      const normalizedAddress = (
        addr.address_name ||
        doc.address_name ||
        doc.road_address?.address_name ||
        ''
      ).trim();
      return {
        bCode,
        mainNo,
        subNo,
        normalizedAddress,
      };
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
    if (externalSignal) externalSignal.removeEventListener('abort', onAbort);
  }
}
