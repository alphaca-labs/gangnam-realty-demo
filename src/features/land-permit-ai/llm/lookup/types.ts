import 'server-only';

export type AutoLookupSource = 'vworld' | 'mock' | 'skipped' | 'failed';

export type AutoLookupFilledField = 'landCategory' | 'landArea' | 'landZone';

export interface AutoLookupResult {
  applied: boolean;
  source: AutoLookupSource;
  filled: AutoLookupFilledField[];
  note?: string;
}

export interface PnuParts {
  bCode: string;
  mainNo: number;
  subNo: number;
}

export interface KakaoAddressResult {
  bCode: string;
  mainNo: number;
  subNo: number;
  normalizedAddress: string;
}

export interface VworldParcelResult {
  pnu: string;
  jibun?: string;
  areaSqm?: number;
}

export interface VworldLandUseResult {
  pnu: string;
  category?: string;
  zone?: string;
}

export interface CombinedLandData {
  category?: string;
  areaSqm?: number;
  zone?: string;
}
