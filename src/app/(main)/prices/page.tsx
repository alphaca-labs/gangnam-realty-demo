'use client';

import { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Hash, Search, ChevronUp, ChevronDown } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  transactions,
  dongList,
  getComplexesByDong,
} from '@/data/mock-transactions';

type SortKey = 'dong' | 'complex' | 'area' | 'floor' | 'price' | 'date' | 'type';
type SortDir = 'asc' | 'desc';

export default function PricesPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDong, setSelectedDong] = useState('전체');
  const [selectedComplex, setSelectedComplex] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset complex when dong changes
  useEffect(() => {
    setSelectedComplex('전체');
  }, [selectedDong]);

  // Available complexes for selected dong
  const complexOptions = useMemo(() => {
    if (selectedDong === '전체') {
      return [...new Set(transactions.map((t) => t.complex))].sort();
    }
    return getComplexesByDong(selectedDong);
  }, [selectedDong]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedDong !== '전체' && t.dong !== selectedDong) return false;
      if (selectedComplex !== '전체' && t.complex !== selectedComplex) return false;
      if (searchQuery && !t.complex.includes(searchQuery)) return false;
      return true;
    });
  }, [selectedDong, selectedComplex, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    if (filtered.length === 0) {
      return { count: 0, avg: 0, max: 0, min: 0 };
    }
    const prices = filtered.map((t) => t.price);
    return {
      count: filtered.length,
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      max: Math.max(...prices),
      min: Math.min(...prices),
    };
  }, [filtered]);

  // Monthly average chart data
  const chartData = useMemo(() => {
    const monthMap = new Map<string, { sum: number; count: number }>();
    filtered.forEach((t) => {
      const existing = monthMap.get(t.date) || { sum: 0, count: 0 };
      monthMap.set(t.date, {
        sum: existing.sum + t.price,
        count: existing.count + 1,
      });
    });
    return Array.from(monthMap.entries())
      .map(([date, { sum, count }]) => ({
        date,
        avgPrice: Math.round(sum / count),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  // Sorted table data
  const sortedData = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'dong':
          cmp = a.dong.localeCompare(b.dong);
          break;
        case 'complex':
          cmp = a.complex.localeCompare(b.complex);
          break;
        case 'area':
          cmp = a.area - b.area;
          break;
        case 'floor':
          cmp = a.floor - b.floor;
          break;
        case 'price':
          cmp = a.price - b.price;
          break;
        case 'date':
          cmp = a.date.localeCompare(b.date);
          break;
        case 'type':
          cmp = a.type.localeCompare(b.type);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function formatPrice(price: number) {
    if (price >= 10000) {
      const uk = Math.floor(price / 10000);
      const remainder = price % 10000;
      return remainder > 0 ? `${uk}억 ${remainder.toLocaleString()}` : `${uk}억`;
    }
    return `${price.toLocaleString()}만원`;
  }

  const statCards = [
    {
      label: '거래 건수',
      value: `${stats.count}건`,
      icon: Hash,
      color: 'text-[#1B4D8E]',
      bg: 'bg-[#E3F2FD]',
    },
    {
      label: '평균가',
      value: stats.avg ? formatPrice(stats.avg) : '-',
      icon: BarChart3,
      color: 'text-[#10A37F]',
      bg: 'bg-[#D1FAE5]',
    },
    {
      label: '최고가',
      value: stats.max ? formatPrice(stats.max) : '-',
      icon: TrendingUp,
      color: 'text-[#EF4444]',
      bg: 'bg-red-50',
    },
    {
      label: '최저가',
      value: stats.min ? formatPrice(stats.min) : '-',
      icon: TrendingDown,
      color: 'text-[#6B7280]',
      bg: 'bg-gray-100',
    },
  ];

  const columns: { key: SortKey; label: string }[] = [
    { key: 'dong', label: '동' },
    { key: 'complex', label: '단지명' },
    { key: 'area', label: '면적(㎡)' },
    { key: 'floor', label: '층' },
    { key: 'price', label: '거래가(만원)' },
    { key: 'date', label: '거래일' },
    { key: 'type', label: '유형' },
  ];

  return (
    <div className="flex-1 overflow-y-auto pt-14 lg:pt-0">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A2E] sm:text-3xl">
            실거래가 시각화 대시보드
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            강남구 주요 단지 실거래가 분석
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#6B7280]">동 선택</label>
            <select
              value={selectedDong}
              onChange={(e) => setSelectedDong(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#1A1A2E] outline-none transition-colors focus:border-[#1B4D8E] focus:ring-1 focus:ring-[#1B4D8E]"
            >
              <option value="전체">전체</option>
              {dongList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#6B7280]">단지 선택</label>
            <select
              value={selectedComplex}
              onChange={(e) => setSelectedComplex(e.target.value)}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#1A1A2E] outline-none transition-colors focus:border-[#1B4D8E] focus:ring-1 focus:ring-[#1B4D8E]"
            >
              <option value="전체">전체</option>
              {complexOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.bg}`}
              >
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#6B7280]">{card.label}</p>
                <p className="truncate text-lg font-bold text-[#1A1A2E]">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Line Chart */}
        <div className="mb-6 rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <h2 className="mb-4 text-base font-semibold text-[#1A1A2E]">
            월별 평균 거래가 추이
          </h2>
          {mounted && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={(v: number) =>
                    v >= 10000 ? `${(v / 10000).toFixed(0)}억` : `${v.toLocaleString()}`
                  }
                />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`${Number(value).toLocaleString()}만원`, '평균가']}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  labelFormatter={(label: any) => `${label}`}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    fontSize: '13px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgPrice"
                  stroke="#1B4D8E"
                  strokeWidth={2.5}
                  dot={{ fill: '#1B4D8E', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#1B4D8E', stroke: '#E3F2FD', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : mounted && chartData.length === 0 ? (
            <div className="flex h-[320px] items-center justify-center text-sm text-[#6B7280]">
              선택된 조건에 해당하는 데이터가 없습니다.
            </div>
          ) : (
            <div className="flex h-[320px] items-center justify-center text-sm text-[#6B7280]">
              차트 로딩 중...
            </div>
          )}
        </div>

        {/* Transaction Table */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white">
          {/* Table Header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
            <h2 className="text-base font-semibold text-[#1A1A2E]">
              거래 내역
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="단지명 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] bg-white py-1.5 pl-9 pr-3 text-sm text-[#1A1A2E] outline-none transition-colors placeholder:text-[#6B7280] focus:border-[#1B4D8E] focus:ring-1 focus:ring-[#1B4D8E]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F7F7F8]">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="cursor-pointer px-4 py-2.5 text-left text-xs font-semibold text-[#6B7280] transition-colors hover:text-[#1A1A2E] select-none"
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        ) : null}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((t, i) => (
                    <tr
                      key={t.id}
                      className={`border-b border-[#E5E7EB] transition-colors hover:bg-[#F7F7F8] ${
                        i % 2 === 1 ? 'bg-[#FAFAFA]' : 'bg-white'
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-2.5 text-[#1A1A2E]">
                        {t.dong}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-medium text-[#1A1A2E]">
                        {t.complex}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[#1A1A2E]">
                        {t.area}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[#1A1A2E]">
                        {t.floor}층
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-semibold text-[#1B4D8E]">
                        {t.price.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[#6B7280]">
                        {t.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <span className="inline-flex rounded-lg bg-[#E3F2FD] px-2 py-0.5 text-xs font-medium text-[#1B4D8E]">
                          {t.type}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-sm text-[#6B7280]"
                    >
                      해당 조건에 맞는 거래 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="border-t border-[#E5E7EB] px-4 py-2.5 text-xs text-[#6B7280]">
            총 {sortedData.length}건
          </div>
        </div>
      </div>
    </div>
  );
}
