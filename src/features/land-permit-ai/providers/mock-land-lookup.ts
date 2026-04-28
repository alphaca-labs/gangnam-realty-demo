import type { LandLookupProvider, LandLookupResult } from '../types/providers';

interface MockEntry {
  keywords: string[];
  defaultLotNumber: string;
  category: string;
  areaSqm: number;
  zone: string;
}

const dongTable: MockEntry[] = [
  {
    keywords: ['압구정동', '압구정'],
    defaultLotNumber: '123-45',
    category: '대',
    areaSqm: 198.5,
    zone: '제3종일반주거지역',
  },
  {
    keywords: ['청담동', '청담'],
    defaultLotNumber: '88-12',
    category: '대',
    areaSqm: 213.7,
    zone: '제3종일반주거지역',
  },
  {
    keywords: ['삼성동', '삼성'],
    defaultLotNumber: '167-3',
    category: '대',
    areaSqm: 256.4,
    zone: '일반상업지역',
  },
  {
    keywords: ['역삼동', '역삼'],
    defaultLotNumber: '456-78',
    category: '대',
    areaSqm: 184.2,
    zone: '제2종일반주거지역',
  },
  {
    keywords: ['대치동', '대치'],
    defaultLotNumber: '514-21',
    category: '대',
    areaSqm: 172.9,
    zone: '제3종일반주거지역',
  },
  {
    keywords: ['논현동', '논현'],
    defaultLotNumber: '789-12',
    category: '대',
    areaSqm: 145.3,
    zone: '준주거지역',
  },
  {
    keywords: ['도곡동', '도곡'],
    defaultLotNumber: '450-1',
    category: '대',
    areaSqm: 207.1,
    zone: '제3종일반주거지역',
  },
];

const fallback: LandLookupResult = {
  category: '대',
  areaSqm: 180.0,
  zone: '제2종일반주거지역',
  source: 'mock',
};

function findEntry(query: string): MockEntry | null {
  const q = query.replace(/\s+/g, '');
  for (const e of dongTable) {
    for (const k of e.keywords) {
      if (q.includes(k)) return e;
    }
  }
  return null;
}

function jitter(base: number, lotNumber: string): number {
  if (!lotNumber) return base;
  let h = 0;
  for (let i = 0; i < lotNumber.length; i += 1) h = (h * 31 + lotNumber.charCodeAt(i)) >>> 0;
  const delta = ((h % 200) - 100) / 10;
  const result = Math.max(40, base + delta);
  return Math.round(result * 10) / 10;
}

export class MockLandLookupProvider implements LandLookupProvider {
  async lookup(address: string, lotNumber: string): Promise<LandLookupResult> {
    await new Promise((r) => setTimeout(r, 250));
    const entry = findEntry(address);
    if (!entry) {
      return { ...fallback, areaSqm: jitter(fallback.areaSqm, lotNumber) };
    }
    return {
      category: entry.category,
      areaSqm: jitter(entry.areaSqm, lotNumber || entry.defaultLotNumber),
      zone: entry.zone,
      source: 'mock',
    };
  }
}

export function getDefaultLotNumber(address: string): string {
  const entry = findEntry(address);
  return entry?.defaultLotNumber ?? '';
}
