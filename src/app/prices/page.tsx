'use client';

import { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockTransactions, priceChartData, dongs } from '@/data/mock-transactions';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function PricesPage() {
  const [selectedDong, setSelectedDong] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    let result = mockTransactions;

    if (selectedDong !== '전체') {
      result = result.filter((t) => t.dong === selectedDong);
    }

    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.complex.includes(searchTerm) ||
          t.dong.includes(searchTerm)
      );
    }

    return result;
  }, [selectedDong, searchTerm]);

  const stats = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return { avg: 0, max: 0, min: 0, count: 0 };
    }

    const prices = filteredTransactions.map((t) => t.price);
    return {
      avg: Math.floor(prices.reduce((a, b) => a + b, 0) / prices.length),
      max: Math.max(...prices),
      min: Math.min(...prices),
      count: prices.length,
    };
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">실거래가 조회</h1>
            <p className="text-sm text-text-secondary">강남구 아파트 실거래 데이터</p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-border">
            <div className="text-xs text-text-secondary mb-1">평균가</div>
            <div className="text-lg font-bold text-primary">{formatNumber(stats.avg)}만</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-border">
            <div className="text-xs text-text-secondary mb-1">최고가</div>
            <div className="text-lg font-bold text-accent">{formatNumber(stats.max)}만</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-border">
            <div className="text-xs text-text-secondary mb-1">최저가</div>
            <div className="text-lg font-bold">{formatNumber(stats.min)}만</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-border">
            <div className="text-xs text-text-secondary mb-1">거래 건수</div>
            <div className="text-lg font-bold">{stats.count}건</div>
          </div>
        </div>

        {/* 차트 */}
        <div className="bg-white p-6 rounded-xl border border-border mb-6">
          <h2 className="font-semibold text-lg mb-4">지역별 가격 추이</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${formatNumber(value)}만원`}
                />
                <Legend />
                <Line type="monotone" dataKey="압구정동" stroke="#1B4D8E" strokeWidth={2} />
                <Line type="monotone" dataKey="청담동" stroke="#10A37F" strokeWidth={2} />
                <Line type="monotone" dataKey="삼성동" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="대치동" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 필터 & 테이블 */}
        <div className="bg-white p-6 rounded-xl border border-border">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">지역 선택</label>
              <select
                value={selectedDong}
                onChange={(e) => setSelectedDong(e.target.value)}
                className="w-full px-4 py-2 border border-input-border rounded-lg"
              >
                {dongs.map((dong) => (
                  <option key={dong} value={dong}>
                    {dong}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">검색</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="단지명 또는 동 검색"
                className="w-full px-4 py-2 border border-input-border rounded-lg"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-semibold">거래일</th>
                  <th className="text-left py-3 px-3 font-semibold">지역</th>
                  <th className="text-left py-3 px-3 font-semibold">단지명</th>
                  <th className="text-left py-3 px-3 font-semibold">면적</th>
                  <th className="text-left py-3 px-3 font-semibold">층</th>
                  <th className="text-right py-3 px-3 font-semibold">거래가</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-sidebar transition-colors">
                    <td className="py-3 px-3">{tx.date}</td>
                    <td className="py-3 px-3">{tx.dong}</td>
                    <td className="py-3 px-3">{tx.complex}</td>
                    <td className="py-3 px-3">{tx.area}㎡</td>
                    <td className="py-3 px-3">{tx.floor}층</td>
                    <td className="py-3 px-3 text-right font-semibold text-primary">
                      {formatCurrency(tx.price * 10000)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
