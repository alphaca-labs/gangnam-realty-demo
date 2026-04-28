'use client';

import { useState, useCallback } from 'react';
import { MapPin, X, Filter, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ──────────────────────────────────────────────
   Marker data — percentage positions on the map
   ────────────────────────────────────────────── */
interface MarkerData {
  id: string;
  name: string;
  dong: string;
  top: number;   // %
  left: number;  // %
  avgPrice: string;       // display string e.g. "31억"
  avgPriceShort: string;  // short for legend e.g. "31만"
  area: string;           // representative 면적
  lastTrade: string;      // 최근 거래
}

const MARKERS: MarkerData[] = [
  { id: 'ap1', name: '현대아파트', dong: '압구정동', top: 25, left: 35, avgPrice: '31억', avgPriceShort: '31만/㎡', area: '196㎡', lastTrade: '2025.12' },
  { id: 'dc1', name: '래미안대치팰리스', dong: '대치동', top: 45, left: 55, avgPrice: '28억 5,000만', avgPriceShort: '28.5만/㎡', area: '114㎡', lastTrade: '2026.01' },
  { id: 'dc2', name: '은마아파트', dong: '대치동', top: 48, left: 50, avgPrice: '27억', avgPriceShort: '27만/㎡', area: '115㎡', lastTrade: '2025.11' },
  { id: 'ss1', name: '아이파크', dong: '삼성동', top: 30, left: 60, avgPrice: '27억', avgPriceShort: '27만/㎡', area: '178㎡', lastTrade: '2025.10' },
  { id: 'ys1', name: '개나리래미안', dong: '역삼동', top: 55, left: 40, avgPrice: '18억', avgPriceShort: '18만/㎡', area: '84㎡', lastTrade: '2026.02' },
  { id: 'dg1', name: '타워팰리스', dong: '도곡동', top: 60, left: 50, avgPrice: '55억', avgPriceShort: '55만/㎡', area: '244㎡', lastTrade: '2025.09' },
  { id: 'cd1', name: '청담자이', dong: '청담동', top: 28, left: 50, avgPrice: '34억', avgPriceShort: '34만/㎡', area: '162㎡', lastTrade: '2025.12' },
  { id: 'gp1', name: '래미안블레스티지', dong: '개포동', top: 65, left: 55, avgPrice: '24억 5,000만', avgPriceShort: '24.5만/㎡', area: '112㎡', lastTrade: '2026.01' },
  { id: 'nh1', name: '논현아이파크', dong: '논현동', top: 40, left: 25, avgPrice: '22억 8,000만', avgPriceShort: '22.8만/㎡', area: '131㎡', lastTrade: '2025.11' },
  { id: 'ss2', name: '힐스테이트', dong: '삼성동', top: 33, left: 65, avgPrice: '32억', avgPriceShort: '32만/㎡', area: '175㎡', lastTrade: '2026.02' },
  { id: 'dg2', name: '도곡렉슬', dong: '도곡동', top: 58, left: 45, avgPrice: '26억', avgPriceShort: '26만/㎡', area: '119㎡', lastTrade: '2025.10' },
  { id: 'gp2', name: '디에이치아너힐즈', dong: '개포동', top: 68, left: 60, avgPrice: '27억', avgPriceShort: '27만/㎡', area: '101㎡', lastTrade: '2026.03' },
];

/* ──────────────────────────────────
   Dong area overlay data
   ────────────────────────────────── */
interface DongArea {
  name: string;
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;       // bg color for overlay
  labelTop: number;
  labelLeft: number;
}

const DONG_AREAS: DongArea[] = [
  { name: '압구정동', top: 15, left: 25, width: 22, height: 18, color: 'bg-blue-400/10', labelTop: 20, labelLeft: 30 },
  { name: '청담동',   top: 18, left: 42, width: 18, height: 16, color: 'bg-purple-400/10', labelTop: 22, labelLeft: 46 },
  { name: '삼성동',   top: 22, left: 55, width: 20, height: 20, color: 'bg-rose-400/10', labelTop: 26, labelLeft: 62 },
  { name: '논현동',   top: 32, left: 15, width: 18, height: 18, color: 'bg-amber-400/10', labelTop: 36, labelLeft: 20 },
  { name: '역삼동',   top: 44, left: 28, width: 22, height: 18, color: 'bg-teal-400/10', labelTop: 50, labelLeft: 34 },
  { name: '대치동',   top: 38, left: 45, width: 18, height: 18, color: 'bg-indigo-400/10', labelTop: 42, labelLeft: 52 },
  { name: '도곡동',   top: 52, left: 38, width: 20, height: 16, color: 'bg-emerald-400/10', labelTop: 55, labelLeft: 42 },
  { name: '개포동',   top: 58, left: 50, width: 22, height: 18, color: 'bg-orange-400/10', labelTop: 62, labelLeft: 56 },
];

/* ──────────────────────────────────
   Filter types
   ────────────────────────────────── */
type PropertyType = '아파트' | '오피스텔' | '다세대';

const PROPERTY_TYPES: PropertyType[] = ['아파트', '오피스텔', '다세대'];

/* ──────────────────────────────────
   Legend data
   ────────────────────────────────── */
const LEGEND_ITEMS = [
  { label: '20억 미만', color: 'bg-emerald-500' },
  { label: '20~30억', color: 'bg-blue-500' },
  { label: '30~40억', color: 'bg-amber-500' },
  { label: '40억 이상', color: 'bg-rose-500' },
];

function getMarkerColor(avgPrice: string): string {
  // Parse the leading number from the price string
  const num = parseInt(avgPrice.replace(/[^0-9]/g, ''));
  if (num < 20) return 'bg-emerald-500 shadow-emerald-500/30';
  if (num < 30) return 'bg-blue-500 shadow-blue-500/30';
  if (num < 40) return 'bg-amber-500 shadow-amber-500/30';
  return 'bg-rose-500 shadow-rose-500/30';
}

function getLegendDotColor(avgPrice: string): string {
  const num = parseInt(avgPrice.replace(/[^0-9]/g, ''));
  if (num < 20) return 'bg-emerald-500';
  if (num < 30) return 'bg-blue-500';
  if (num < 40) return 'bg-amber-500';
  return 'bg-rose-500';
}

/* ══════════════════════════════════
   MapPage Component
   ══════════════════════════════════ */
export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number>(100);
  const [propertyTypes, setPropertyTypes] = useState<Set<PropertyType>>(
    new Set(PROPERTY_TYPES)
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedMarker((prev) => (prev === id ? null : id));
  }, []);

  const togglePropertyType = useCallback((type: PropertyType) => {
    setPropertyTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const selected = MARKERS.find((m) => m.id === selectedMarker) ?? null;

  return (
    <div className="flex-1 overflow-y-auto pt-14 lg:pt-0">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* ── Page Header ── */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            강남구 부동산 지도
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            주요 단지 위치와 시세 정보
          </p>
        </div>

        {/* ── Filter Toggle (mobile) ── */}
        <div className="mb-4 flex justify-end lg:hidden">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/50"
          >
            <Filter className="h-4 w-4" />
            필터
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ── Filter Panel ── */}
          <div
            className={cn(
              'shrink-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all lg:block lg:w-[220px]',
              filterOpen ? 'block' : 'hidden'
            )}
          >
            <div className="border-b border-border px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Filter className="h-4 w-4 text-muted-foreground" />
                필터
              </h2>
            </div>
            <div className="px-4 py-4">
              {/* Price Range Slider */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  가격대 (최대)
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
                />
                <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>5억</span>
                  <span className="font-semibold text-primary">{priceRange}억</span>
                  <span>100억</span>
                </div>
              </div>

              {/* Property Type Checkboxes */}
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  유형
                </label>
                <div className="flex flex-col gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => togglePropertyType(type)}
                      className="flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {propertyTypes.has(type) ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Map Container ── */}
          <div className="flex-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100 shadow-sm">
              {/* Grid pattern overlay for map texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Subtle "river" line at top (한강) */}
              <div className="pointer-events-none absolute left-0 right-0 top-[8%] h-[6%] bg-gradient-to-b from-sky-200/40 to-sky-100/20" />
              <span className="pointer-events-none absolute left-[12%] top-[9%] text-[10px] font-medium tracking-wide text-sky-400/70">
                한강
              </span>

              {/* Simplified district boundary */}
              <div className="pointer-events-none absolute inset-[5%] rounded-2xl border-2 border-dashed border-slate-300/50" />

              {/* Dong colored overlays */}
              {DONG_AREAS.map((dong) => (
                <div key={dong.name}>
                  {/* Semi-transparent area */}
                  <div
                    className={cn(
                      'pointer-events-none absolute rounded-xl border border-slate-200/50',
                      dong.color
                    )}
                    style={{
                      top: `${dong.top}%`,
                      left: `${dong.left}%`,
                      width: `${dong.width}%`,
                      height: `${dong.height}%`,
                    }}
                  />
                  {/* Dong label */}
                  <span
                    className="pointer-events-none absolute text-[11px] font-medium text-slate-500/70"
                    style={{
                      top: `${dong.labelTop}%`,
                      left: `${dong.labelLeft}%`,
                    }}
                  >
                    {dong.name}
                  </span>
                </div>
              ))}

              {/* Road lines */}
              <div className="pointer-events-none absolute left-[48%] top-[14%] h-[75%] w-px bg-slate-300/60" />
              <div className="pointer-events-none absolute left-[10%] top-[48%] h-px w-[80%] bg-slate-300/60" />
              <div className="pointer-events-none absolute left-[30%] top-[14%] h-[75%] w-px rotate-[15deg] bg-slate-300/40" />
              {/* Road labels */}
              <span className="pointer-events-none absolute left-[49%] top-[80%] text-[9px] text-slate-400/70">
                테헤란로
              </span>
              <span className="pointer-events-none absolute left-[70%] top-[49%] text-[9px] text-slate-400/70">
                영동대로
              </span>

              {/* Markers */}
              {MARKERS.map((marker) => (
                <button
                  key={marker.id}
                  onClick={() => handleMarkerClick(marker.id)}
                  className={cn(
                    'group absolute z-10 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-150 hover:z-20',
                    getMarkerColor(marker.avgPrice),
                    selectedMarker === marker.id && 'scale-150 z-20 ring-2 ring-white'
                  )}
                  style={{
                    top: `${marker.top}%`,
                    left: `${marker.left}%`,
                  }}
                  title={`${marker.dong} ${marker.name}`}
                >
                  {/* Pulse ring on hover */}
                  <span className="absolute inset-0 animate-ping rounded-full bg-inherit opacity-0 transition-opacity group-hover:opacity-40" />
                </button>
              ))}

              {/* Popup Card */}
              {selected && (
                <div
                  className="absolute z-30 w-56 rounded-xl border border-border bg-white p-4 shadow-lg"
                  style={{
                    top: `${Math.min(selected.top + 3, 70)}%`,
                    left: `${Math.min(Math.max(selected.left - 10, 5), 60)}%`,
                  }}
                >
                  <button
                    onClick={() => setSelectedMarker(null)}
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="mb-0.5 text-xs text-muted-foreground">{selected.dong}</p>
                  <p className="mb-3 text-sm font-bold text-foreground">{selected.name}</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">평균 매매가</span>
                      <span className="font-semibold text-primary">{selected.avgPrice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">대표 면적</span>
                      <span className="font-medium text-foreground">{selected.area}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">최근 거래</span>
                      <span className="font-medium text-foreground">{selected.lastTrade}</span>
                    </div>
                  </div>
                  {/* Small colored dot indicator */}
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className={cn('h-2 w-2 rounded-full', getLegendDotColor(selected.avgPrice))} />
                    <span className="text-[10px] text-muted-foreground">시세 기준 색상</span>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="absolute bottom-3 right-3 z-20 rounded-lg border border-border bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
                <p className="mb-1.5 text-[10px] font-semibold text-muted-foreground">
                  평균 매매가
                </p>
                <div className="flex flex-col gap-1">
                  {LEGEND_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <span className={cn('h-2 w-2 rounded-full', item.color)} />
                      <span className="text-[10px] text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* "강남구" label */}
              <div className="absolute left-3 top-3 z-20 rounded-lg bg-primary/90 px-2.5 py-1 shadow-sm">
                <span className="text-xs font-bold text-white">강남구</span>
              </div>
            </div>

            {/* ── Stats bar below map ── */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                <p className="text-xs text-muted-foreground">표시 단지</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{MARKERS.length}개</p>
              </div>
              <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                <p className="text-xs text-muted-foreground">최고 시세</p>
                <p className="mt-0.5 text-lg font-bold text-rose-500">55억</p>
              </div>
              <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                <p className="text-xs text-muted-foreground">최저 시세</p>
                <p className="mt-0.5 text-lg font-bold text-emerald-500">18억</p>
              </div>
              <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
                <p className="text-xs text-muted-foreground">조회 동 수</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{DONG_AREAS.length}개</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info Note ── */}
        <div className="mt-6 mb-8 flex items-start gap-2.5 rounded-xl bg-muted/50 px-4 py-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            * 본 지도는 데모용 정적 지도이며, 실제 위치와 다를 수 있습니다.
            시세 데이터는 참고용이며 실제 거래가와 차이가 있을 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
