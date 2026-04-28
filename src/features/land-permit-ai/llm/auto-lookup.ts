import 'server-only';
import type { Answers } from '../types/answers';
import { MockLandLookupProvider } from '../providers/mock-land-lookup';
import { getLookupCache, LookupCache } from './lookup/cache';
import { fetchKakaoAddress, getKakaoApiKey } from './lookup/kakao';
import { fetchVworldLandUse, fetchVworldParcel, getVworldApiKey } from './lookup/vworld';
import { buildPnu, normalizeLotNumber, validateLotNumber } from './lookup/pnu';
import type {
  AutoLookupFilledField,
  AutoLookupResult,
  CombinedLandData,
} from './lookup/types';

const FIELDS: AutoLookupFilledField[] = ['landCategory', 'landArea', 'landZone'];

interface ApplicationLikely {
  landAddress?: unknown;
  landLotNumber?: unknown;
  landCategory?: unknown;
  landArea?: unknown;
  landZone?: unknown;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function getApplication(merged: Answers): ApplicationLikely {
  const m = merged as Record<string, unknown>;
  const app = m.application;
  if (!isPlainObject(app)) return {};
  return app as ApplicationLikely;
}

function asNonEmptyString(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

function isEmptyField(v: unknown): boolean {
  if (v == null) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  return false;
}

function applyFillsToMerged(
  merged: Answers,
  data: CombinedLandData,
  app: ApplicationLikely,
): { merged: Answers; filled: AutoLookupFilledField[] } {
  const filled: AutoLookupFilledField[] = [];
  const next: Record<string, unknown> = { ...(merged as Record<string, unknown>) };
  const nextApp: Record<string, unknown> = isPlainObject(next.application)
    ? { ...(next.application as Record<string, unknown>) }
    : {};

  if (isEmptyField(app.landCategory) && data.category && data.category.trim() !== '') {
    nextApp.landCategory = data.category.trim();
    filled.push('landCategory');
  }
  if (isEmptyField(app.landArea) && data.areaSqm != null && Number.isFinite(data.areaSqm)) {
    const rounded = Math.round(data.areaSqm);
    nextApp.landArea = String(rounded);
    filled.push('landArea');
  }
  if (isEmptyField(app.landZone) && data.zone && data.zone.trim() !== '') {
    nextApp.landZone = data.zone.trim();
    filled.push('landZone');
  }

  next.application = nextApp;
  return { merged: next as Answers, filled };
}

async function mockFallback(
  address: string,
  lotNumber: string,
): Promise<CombinedLandData> {
  const provider = new MockLandLookupProvider();
  const result = await provider.lookup(address, lotNumber);
  return {
    category: result.category,
    areaSqm: result.areaSqm,
    zone: result.zone,
  };
}

async function tryRealLookup(
  address: string,
  lotNumber: string,
  vworldKey: string | undefined,
  kakaoKey: string | undefined,
): Promise<{ data: CombinedLandData; succeeded: boolean }> {
  const lot = normalizeLotNumber(lotNumber);
  if (!lot) return { data: {}, succeeded: false };

  let bCode: string | null = null;
  if (kakaoKey) {
    const k = await fetchKakaoAddress(`${address} ${lotNumber}`, kakaoKey);
    if (k && k.bCode) {
      bCode = k.bCode;
    }
  }

  if (!bCode || !vworldKey) {
    return { data: {}, succeeded: false };
  }

  const pnu = buildPnu({ bCode, mainNo: lot.mainNo, subNo: lot.subNo });
  if (!pnu) return { data: {}, succeeded: false };

  const [parcelRes, landUseRes] = await Promise.allSettled([
    fetchVworldParcel(pnu, vworldKey),
    fetchVworldLandUse(pnu, vworldKey),
  ]);

  const parcel = parcelRes.status === 'fulfilled' ? parcelRes.value : null;
  const landUse = landUseRes.status === 'fulfilled' ? landUseRes.value : null;

  const data: CombinedLandData = {
    category: landUse?.category,
    areaSqm: parcel?.areaSqm,
    zone: landUse?.zone,
  };

  const succeeded = data.category != null || data.areaSqm != null || data.zone != null;
  return { data, succeeded };
}

export async function applyAutoLandLookup(
  merged: Answers,
  confidence: Record<string, 'high' | 'medium' | 'low'> | undefined,
): Promise<{ merged: Answers; autoLookup: AutoLookupResult }> {
  const app = getApplication(merged);
  const address = asNonEmptyString(app.landAddress);
  const lotNumber = asNonEmptyString(app.landLotNumber);

  if (!address || !lotNumber) {
    return {
      merged,
      autoLookup: { applied: false, source: 'skipped', filled: [] },
    };
  }
  if (!validateLotNumber(lotNumber)) {
    return {
      merged,
      autoLookup: { applied: false, source: 'skipped', filled: [] },
    };
  }

  const allFilled = FIELDS.every((f) => !isEmptyField((app as Record<string, unknown>)[f]));
  if (allFilled) {
    return {
      merged,
      autoLookup: { applied: false, source: 'skipped', filled: [] },
    };
  }

  const addrConf = confidence?.['application.landAddress'];
  if (addrConf === 'low') {
    return {
      merged,
      autoLookup: {
        applied: false,
        source: 'skipped',
        filled: [],
        note: '주소 신뢰도가 낮아 자동 조회를 건너뛰었습니다.',
      },
    };
  }

  const vworldKey = getVworldApiKey();
  const kakaoKey = getKakaoApiKey();

  const cache = getLookupCache();
  const cacheKey = LookupCache.hashKey(address, lotNumber);
  const cached = cache.get(cacheKey);
  if (cached) {
    const { merged: nextMerged, filled } = applyFillsToMerged(merged, cached.data, app);
    if (filled.length === 0) {
      return {
        merged: nextMerged,
        autoLookup: {
          applied: false,
          source: 'skipped',
          filled: [],
          note: '캐시된 결과가 있으나 새로 채울 필드가 없습니다.',
        },
      };
    }
    return {
      merged: nextMerged,
      autoLookup: {
        applied: true,
        source: cached.source,
        filled,
        note:
          cached.source === 'mock'
            ? '캐시된 데모 데이터(mock)로 토지 정보를 채웠습니다.'
            : '캐시된 공공 데이터(VWorld)로 토지 정보를 채웠습니다.',
      },
    };
  }

  let data: CombinedLandData = {};
  let source: 'vworld' | 'mock' | 'failed' = 'failed';

  if (vworldKey && kakaoKey) {
    const real = await tryRealLookup(address, lotNumber, vworldKey, kakaoKey);
    if (real.succeeded) {
      data = real.data;
      source = 'vworld';
    }
  }

  if (source !== 'vworld') {
    try {
      data = await mockFallback(address, lotNumber);
      source = 'mock';
    } catch {
      source = 'failed';
    }
  }

  if (source === 'failed') {
    return {
      merged,
      autoLookup: {
        applied: false,
        source: 'failed',
        filled: [],
        note: '자동 조회에 실패했습니다. 직접 입력해주세요.',
      },
    };
  }

  const { merged: nextMerged, filled } = applyFillsToMerged(merged, data, app);

  cache.set(cacheKey, data, source);

  if (filled.length === 0) {
    return {
      merged: nextMerged,
      autoLookup: {
        applied: false,
        source: 'skipped',
        filled: [],
        note: '자동 조회 결과로 채울 새 필드가 없습니다.',
      },
    };
  }

  const note =
    source === 'mock'
      ? '데모 데이터(mock)로 토지 정보를 자동으로 채웠습니다. 실제 공공 데이터가 아닐 수 있어요.'
      : '공공 데이터(VWorld)로 토지 정보를 자동으로 채웠습니다.';

  return {
    merged: nextMerged,
    autoLookup: {
      applied: true,
      source,
      filled,
      note,
    },
  };
}
