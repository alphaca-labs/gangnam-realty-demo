"use client";

import { useState, useMemo } from "react";
import { BarChart3, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { transactions, dongs, type Dong } from "@/data/mock-transactions";
import { formatPrice, formatDate, formatFullDate } from "@/lib/format";
import {
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

type ViewMode = "chart" | "table";
type PeriodFilter = "3m" | "6m" | "1y" | "3y";
type TypeFilter = "매매" | "전세" | "월세" | "전체";

export default function PricesPage() {
  const [dong, setDong] = useState<Dong>("압구정동");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("전체");
  const [period, setPeriod] = useState<PeriodFilter>("6m");
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [sortKey, setSortKey] = useState<"date" | "price">("date");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    const now = new Date();
    const months: Record<PeriodFilter, number> = { "3m": 3, "6m": 6, "1y": 12, "3y": 36 };
    const cutoff = new Date(now.getFullYear(), now.getMonth() - months[period], now.getDate());

    return transactions.filter((t) => {
      if (t.dong !== dong) return false;
      if (typeFilter !== "전체" && t.type !== typeFilter) return false;
      return new Date(t.contractDate) >= cutoff;
    });
  }, [dong, typeFilter, period]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortKey === "date") return dir * a.contractDate.localeCompare(b.contractDate);
      return dir * (a.price - b.price);
    });
  }, [filtered, sortKey, sortAsc]);

  const chartData = useMemo(() => {
    return [...filtered]
      .sort((a, b) => a.contractDate.localeCompare(b.contractDate))
      .map((t) => ({
        date: formatDate(t.contractDate),
        price: t.price / 10000,
        name: t.complexName,
        area: t.area,
      }));
  }, [filtered]);

  const stats = useMemo(() => {
    if (filtered.length === 0) return null;
    const prices = filtered.map((t) => t.price);
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const maxT = filtered.find((t) => t.price === max)!;
    const minT = filtered.find((t) => t.price === min)!;
    return { avg, max, min, maxT, minT, count: filtered.length };
  }, [filtered]);

  const toggleSort = (key: "date" | "price") => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gangnam-primary/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-gangnam-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gangnam-text">실거래가 조회</h1>
          <p className="text-sm text-gangnam-sub">강남구 아파트 실거래가</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gangnam-text w-12 shrink-0">동</label>
            <div className="flex flex-wrap gap-1.5">
              {dongs.map((d) => (
                <button
                  key={d}
                  onClick={() => setDong(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    dong === d
                      ? "bg-gangnam-primary text-white"
                      : "bg-gangnam-bg text-gangnam-sub hover:bg-gangnam-primary/10"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gangnam-text w-12 shrink-0">유형</label>
            <div className="flex flex-wrap gap-1.5">
              {(["전체", "매매", "전세", "월세"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    typeFilter === t
                      ? "bg-gangnam-primary text-white"
                      : "bg-gangnam-bg text-gangnam-sub hover:bg-gangnam-primary/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gangnam-text w-12 shrink-0">기간</label>
            <div className="flex flex-wrap gap-1.5">
              {(["3m", "6m", "1y", "3y"] as const).map((p) => {
                const labels: Record<PeriodFilter, string> = { "3m": "3개월", "6m": "6개월", "1y": "1년", "3y": "3년" };
                return (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      period === p
                        ? "bg-gangnam-primary text-white"
                        : "bg-gangnam-bg text-gangnam-sub hover:bg-gangnam-primary/10"
                    }`}
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gangnam-sub mb-1">평균 거래가</p>
              <p className="text-base font-bold text-gangnam-primary">{formatPrice(stats.avg)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gangnam-sub mb-1">최고가</p>
              <p className="text-base font-bold text-red-500">{formatPrice(stats.max)}</p>
              <p className="text-[10px] text-gangnam-sub">{stats.maxT.complexName} {stats.maxT.area}㎡</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gangnam-sub mb-1">최저가</p>
              <p className="text-base font-bold text-blue-500">{formatPrice(stats.min)}</p>
              <p className="text-[10px] text-gangnam-sub">{stats.minT.complexName} {stats.minT.area}㎡</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-gangnam-sub mb-1">거래건수</p>
              <p className="text-base font-bold text-gangnam-text">{stats.count}건</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-3">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="chart">차트</TabsTrigger>
            <TabsTrigger value="table">테이블</TabsTrigger>
          </TabsList>
        </Tabs>
        <Badge variant="secondary" className="text-xs ml-auto">
          {filtered.length}건
        </Badge>
      </div>

      {/* Chart View */}
      {viewMode === "chart" && (
        <Card className="mb-4">
          <CardContent className="p-4">
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748B" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#64748B" unit="억" />
                    <Tooltip
                      formatter={(val) => [`${val}억`, "거래가"]}
                      labelFormatter={(l) => `계약일: ${l}`}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="price" fill="#1B4D8E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gangnam-sub py-12">조건에 맞는 거래 데이터가 없습니다.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="mb-4">
          <CardContent className="p-4">
            {sorted.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gangnam-sub">
                      <th
                        className="text-left py-2 pr-2 cursor-pointer hover:text-gangnam-primary"
                        onClick={() => toggleSort("date")}
                      >
                        <span className="flex items-center gap-1">계약일 <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="text-left py-2 px-2">단지명</th>
                      <th className="text-right py-2 px-2">층</th>
                      <th className="text-right py-2 px-2">면적</th>
                      <th
                        className="text-right py-2 pl-2 cursor-pointer hover:text-gangnam-primary"
                        onClick={() => toggleSort("price")}
                      >
                        <span className="flex items-center gap-1 justify-end">금액 <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((t) => (
                      <tr key={t.id} className="border-b border-border/50 hover:bg-gangnam-bg/50">
                        <td className="py-2 pr-2 text-gangnam-sub">{formatFullDate(t.contractDate)}</td>
                        <td className="py-2 px-2 text-gangnam-text font-medium">{t.complexName}</td>
                        <td className="py-2 px-2 text-right">{t.floor}층</td>
                        <td className="py-2 px-2 text-right">{t.area}㎡</td>
                        <td className="py-2 pl-2 text-right font-semibold text-gangnam-primary">{formatPrice(t.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gangnam-sub py-12">조건에 맞는 거래 데이터가 없습니다.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
