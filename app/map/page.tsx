"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

const markers = [
  { id: 1, name: "현대아파트 1차", dong: "압구정동", avgPrice: 290000, lat: 37.527, lng: 127.028, left: "32%", top: "28%" },
  { id: 2, name: "미성아파트 2차", dong: "압구정동", avgPrice: 200000, lat: 37.529, lng: 127.031, left: "28%", top: "22%" },
  { id: 3, name: "한양아파트", dong: "압구정동", avgPrice: 265000, lat: 37.525, lng: 127.026, left: "35%", top: "34%" },
  { id: 4, name: "래미안대치팰리스", dong: "대치동", avgPrice: 350000, lat: 37.494, lng: 127.062, left: "58%", top: "55%" },
  { id: 5, name: "은마아파트", dong: "대치동", avgPrice: 270000, lat: 37.497, lng: 127.058, left: "55%", top: "48%" },
  { id: 6, name: "아이파크삼성", dong: "삼성동", avgPrice: 360000, lat: 37.511, lng: 127.065, left: "62%", top: "38%" },
  { id: 7, name: "래미안삼성", dong: "삼성동", avgPrice: 285000, lat: 37.509, lng: 127.060, left: "60%", top: "42%" },
  { id: 8, name: "개나리래미안", dong: "역삼동", avgPrice: 210000, lat: 37.500, lng: 127.038, left: "42%", top: "52%" },
  { id: 9, name: "래미안역삼", dong: "역삼동", avgPrice: 260000, lat: 37.502, lng: 127.042, left: "45%", top: "46%" },
  { id: 10, name: "삼성래미안", dong: "삼성동", avgPrice: 310000, lat: 37.514, lng: 127.058, left: "57%", top: "35%" },
];

export default function MapPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gangnam-primary/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-gangnam-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gangnam-text">강남구 부동산 지도</h1>
          <p className="text-sm text-gangnam-sub">주요 단지 위치와 시세를 확인하세요</p>
        </div>
      </div>

      {/* Static Map */}
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-br from-green-50 via-blue-50 to-green-100 h-80 md:h-[480px]">
            {/* Road grid for decoration */}
            <div className="absolute inset-0">
              <div className="absolute top-1/3 left-0 right-0 h-px bg-gray-300/60" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-gray-300/60" />
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gray-300/60" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gray-300/60" />
              {/* Main road */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-300/40" />
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-300/40" />
            </div>

            {/* Markers */}
            {markers.map((m) => (
              <div
                key={m.id}
                className="absolute group cursor-pointer"
                style={{ left: m.left, top: m.top }}
              >
                <div className="relative">
                  <MapPin className="w-7 h-7 text-red-500 drop-shadow-md -translate-x-1/2 -translate-y-full" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                    <div className="bg-white rounded-lg shadow-lg p-2.5 whitespace-nowrap text-xs">
                      <p className="font-bold text-gangnam-text">{m.name}</p>
                      <p className="text-gangnam-sub">{m.dong}</p>
                      <p className="text-gangnam-primary font-semibold mt-0.5">평균 {formatPrice(m.avgPrice)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Area labels */}
            <div className="absolute left-[25%] top-[15%] text-xs font-bold text-gangnam-primary/60">압구정동</div>
            <div className="absolute left-[50%] top-[60%] text-xs font-bold text-gangnam-primary/60">대치동</div>
            <div className="absolute left-[65%] top-[30%] text-xs font-bold text-gangnam-primary/60">삼성동</div>
            <div className="absolute left-[38%] top-[58%] text-xs font-bold text-gangnam-primary/60">역삼동</div>

            {/* Center label */}
            <div className="absolute top-4 left-4 bg-white/90 rounded-lg px-3 py-1.5 shadow-sm">
              <p className="text-xs font-bold text-gangnam-text">강남구</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm text-gangnam-text mb-3">주요 단지 목록</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {markers.slice(0, 9).map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 px-3 bg-gangnam-bg rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gangnam-text">{m.name}</p>
                    <p className="text-xs text-gangnam-sub">{m.dong}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs bg-gangnam-primary/10 text-gangnam-primary">
                  {formatPrice(m.avgPrice)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
