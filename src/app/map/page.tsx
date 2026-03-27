'use client';

import { useState } from 'react';
import { Map, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Marker {
  id: string;
  name: string;
  dong: string;
  price: number;
  area: number;
  lat: number;
  lng: number;
}

const markers: Marker[] = [
  { id: '1', name: '압구정 현대', dong: '압구정동', price: 250000, area: 84, lat: 37.527, lng: 127.028 },
  { id: '2', name: '압구정 한양', dong: '압구정동', price: 240000, area: 84, lat: 37.530, lng: 127.027 },
  { id: '3', name: '청담 IPARK', dong: '청담동', price: 260000, area: 84, lat: 37.520, lng: 127.047 },
  { id: '4', name: '청담 래미안', dong: '청담동', price: 255000, area: 84, lat: 37.522, lng: 127.050 },
  { id: '5', name: '삼성 래미안', dong: '삼성동', price: 230000, area: 84, lat: 37.513, lng: 127.058 },
  { id: '6', name: '은마아파트', dong: '대치동', price: 220000, area: 84, lat: 37.494, lng: 127.062 },
  { id: '7', name: '대치 래미안', dong: '대치동', price: 225000, area: 84, lat: 37.492, lng: 127.065 },
  { id: '8', name: '도곡 렉슬', dong: '도곡동', price: 210000, area: 84, lat: 37.487, lng: 127.050 },
];

export default function MapPage() {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [priceFilter, setPriceFilter] = useState([0, 300000]);

  const filteredMarkers = markers.filter(
    (m) => m.price >= priceFilter[0] && m.price <= priceFilter[1]
  );

  return (
    <div className="h-screen bg-background flex flex-col pb-20 md:pb-0">
      {/* 헤더 */}
      <div className="flex items-center gap-3 p-4 md:p-6 border-b border-border bg-white">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Map className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">강남구 부동산 지도</h1>
          <p className="text-xs text-text-secondary">주요 아파트 위치 (데모)</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 사이드 패널 */}
        <div className="w-80 bg-white border-r border-border p-4 overflow-y-auto hidden md:block">
          <h3 className="font-semibold mb-4">필터</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">가격대 (만원)</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={priceFilter[0]}
                onChange={(e) => setPriceFilter([Number(e.target.value), priceFilter[1]])}
                className="w-full px-3 py-2 border border-input-border rounded-lg text-sm"
              />
              <span>~</span>
              <input
                type="number"
                value={priceFilter[1]}
                onChange={(e) => setPriceFilter([priceFilter[0], Number(e.target.value)])}
                className="w-full px-3 py-2 border border-input-border rounded-lg text-sm"
              />
            </div>
          </div>

          <h3 className="font-semibold mb-3">매물 목록 ({filteredMarkers.length})</h3>
          <div className="space-y-2">
            {filteredMarkers.map((marker) => (
              <button
                key={marker.id}
                onClick={() => setSelectedMarker(marker)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedMarker?.id === marker.id
                    ? 'border-primary bg-primary-light'
                    : 'border-border bg-sidebar hover:bg-sidebar-hover'
                }`}
              >
                <div className="font-medium text-sm">{marker.name}</div>
                <div className="text-xs text-text-secondary">{marker.dong}</div>
                <div className="text-sm font-bold text-primary mt-1">
                  {formatCurrency(marker.price * 10000)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 지도 영역 (정적 이미지 기반) */}
        <div className="flex-1 relative bg-sidebar">
          {/* 정적 지도 배경 (단순 그리드) */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-sidebar via-white to-sidebar relative">
              {/* 그리드 */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1B4D8E" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* 마커 배치 (상대 위치) */}
              {filteredMarkers.map((marker, idx) => {
                const x = 20 + (idx % 4) * 20;
                const y = 20 + Math.floor(idx / 4) * 25;

                return (
                  <div
                    key={marker.id}
                    onClick={() => setSelectedMarker(marker)}
                    className="absolute cursor-pointer transition-transform hover:scale-110"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className="relative">
                      <MapPin
                        className={`w-8 h-8 ${
                          selectedMarker?.id === marker.id
                            ? 'text-primary fill-primary/20'
                            : 'text-accent fill-accent/20'
                        }`}
                      />
                      {selectedMarker?.id === marker.id && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white p-3 rounded-lg shadow-lg border border-border z-50 w-48">
                          <div className="font-semibold text-sm mb-1">{marker.name}</div>
                          <div className="text-xs text-text-secondary mb-2">
                            {marker.dong} · {marker.area}㎡
                          </div>
                          <div className="font-bold text-primary">
                            {formatCurrency(marker.price * 10000)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 범례 */}
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-border">
            <div className="text-sm font-semibold mb-2">범례</div>
            <div className="flex items-center gap-2 text-xs mb-1">
              <MapPin className="w-4 h-4 text-accent fill-accent/20" />
              <span>아파트 단지</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-primary fill-primary/20" />
              <span>선택된 단지</span>
            </div>
          </div>

          {/* 안내 */}
          <div className="absolute top-4 right-4 bg-accent/10 p-3 rounded-lg border border-accent/20 max-w-xs">
            <p className="text-xs text-text-secondary">
              💡 실제 서비스 시 Kakao 지도 API 연동으로 정확한 위치 표시
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
