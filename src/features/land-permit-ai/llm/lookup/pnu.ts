import 'server-only';
import type { PnuParts } from './types';

const LOT_NUMBER_RE = /^(\d+)(?:-(\d+))?$/;

export function validateLotNumber(lotNumber: string): boolean {
  if (!lotNumber) return false;
  return LOT_NUMBER_RE.test(lotNumber.trim());
}

export function normalizeLotNumber(lotNumber: string): { mainNo: number; subNo: number } | null {
  const trimmed = lotNumber.trim();
  const m = LOT_NUMBER_RE.exec(trimmed);
  if (!m) return null;
  const mainNo = Number.parseInt(m[1], 10);
  const subNo = m[2] ? Number.parseInt(m[2], 10) : 0;
  if (!Number.isFinite(mainNo) || !Number.isFinite(subNo)) return null;
  if (mainNo < 0 || subNo < 0) return null;
  return { mainNo, subNo };
}

function pad(n: number, width: number): string {
  const s = String(n);
  if (s.length >= width) return s;
  return '0'.repeat(width - s.length) + s;
}

export function buildPnu(parts: PnuParts, landKind: '1' | '2' = '1'): string | null {
  const { bCode, mainNo, subNo } = parts;
  if (!bCode || bCode.length !== 10 || !/^\d{10}$/.test(bCode)) return null;
  if (!Number.isFinite(mainNo) || !Number.isFinite(subNo)) return null;
  if (mainNo < 0 || subNo < 0) return null;
  if (mainNo > 9999 || subNo > 9999) return null;
  const main = pad(mainNo, 4);
  const sub = pad(subNo, 4);
  return `${bCode}${landKind}${main}${sub}`;
}
