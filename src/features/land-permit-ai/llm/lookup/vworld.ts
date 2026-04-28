import 'server-only';
import { z } from 'zod';
import type { VworldLandUseResult, VworldParcelResult } from './types';

const VWORLD_TIMEOUT_MS = 2000;
const VWORLD_ENDPOINT = 'http://api.vworld.kr/req/data';

export function getVworldApiKey(): string | undefined {
  const v = process.env.VWORLD_API_KEY;
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

const zVworldStatusOk = z.literal('OK');
const zVworldStatus = z.union([zVworldStatusOk, z.string()]);

const zVworldFeatureProperties = z.record(z.string(), z.unknown());

const zVworldFeature = z
  .object({
    properties: zVworldFeatureProperties.optional(),
  })
  .passthrough();

const zVworldFeatureCollection = z
  .object({
    features: z.array(zVworldFeature).nullable().optional(),
  })
  .passthrough();

const zVworldResponse = z
  .object({
    response: z
      .object({
        status: zVworldStatus.optional(),
        result: z
          .object({
            featureCollection: zVworldFeatureCollection.nullable().optional(),
          })
          .passthrough()
          .nullable()
          .optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

function buildUrl(data: 'LP_PA_CBND_BUBUN' | 'LT_C_LANDUSE', pnu: string, key: string): string {
  const params = new URLSearchParams({
    service: 'data',
    request: 'GetFeature',
    data,
    key,
    attrFilter: `pnu:=:${pnu}`,
    format: 'json',
    size: '1',
    geometry: 'false',
  });
  return `${VWORLD_ENDPOINT}?${params.toString()}`;
}

async function callVworld(
  url: string,
  externalSignal?: AbortSignal,
): Promise<unknown | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VWORLD_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', onAbort);
  }
  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    try {
      return await res.json();
    } catch {
      return null;
    }
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
    if (externalSignal) externalSignal.removeEventListener('abort', onAbort);
  }
}

function extractFeatures(json: unknown): Array<Record<string, unknown>> | null {
  const parsed = zVworldResponse.safeParse(json);
  if (!parsed.success) return null;
  const status = parsed.data.response?.status;
  if (status && status !== 'OK') return null;
  const fc = parsed.data.response?.result?.featureCollection;
  if (!fc) return null;
  const features = fc.features;
  if (!features || features.length === 0) return null;
  const props: Array<Record<string, unknown>> = [];
  for (const f of features) {
    if (f && typeof f === 'object' && f.properties && typeof f.properties === 'object') {
      props.push(f.properties as Record<string, unknown>);
    }
  }
  return props.length > 0 ? props : null;
}

function asString(v: unknown): string | undefined {
  if (typeof v === 'string') {
    const t = v.trim();
    return t.length > 0 ? t : undefined;
  }
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return undefined;
}

function asNumber(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const cleaned = v.replace(/[,\s]/g, '');
    if (cleaned === '') return undefined;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export async function fetchVworldParcel(
  pnu: string,
  apiKey: string,
  externalSignal?: AbortSignal,
): Promise<VworldParcelResult | null> {
  if (!apiKey || !pnu) return null;
  const url = buildUrl('LP_PA_CBND_BUBUN', pnu, apiKey);
  const json = await callVworld(url, externalSignal);
  if (!json) return null;
  const features = extractFeatures(json);
  if (!features) return null;
  const p = features[0];
  const areaSqm = asNumber(p.lndpcl_ar);
  const jibun = asString(p.jibun);
  return {
    pnu,
    jibun,
    areaSqm,
  };
}

export async function fetchVworldLandUse(
  pnu: string,
  apiKey: string,
  externalSignal?: AbortSignal,
): Promise<VworldLandUseResult | null> {
  if (!apiKey || !pnu) return null;
  const url = buildUrl('LT_C_LANDUSE', pnu, apiKey);
  const json = await callVworld(url, externalSignal);
  if (!json) return null;
  const features = extractFeatures(json);
  if (!features) return null;
  const p = features[0];
  const category =
    asString(p.lndcgr_code_nm) ||
    asString(p.lndcgr_nm) ||
    asString(p.jimok_nm) ||
    asString(p.lndcgr);
  const zone =
    asString(p.prpos_area_dstrc_nm_1) ||
    asString(p.prpos_area_dstrc_nm) ||
    asString(p.prpos_area_1) ||
    asString(p.prpos_area);
  return {
    pnu,
    category,
    zone,
  };
}
