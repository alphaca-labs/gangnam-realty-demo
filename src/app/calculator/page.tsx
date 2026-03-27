'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { calculateCommission, getCommissionRateTable, TransactionType } from '@/lib/calculator';
import { formatCurrency } from '@/lib/utils';

export default function CalculatorPage() {
  const [type, setType] = useState<TransactionType>('sale');
  const [amount, setAmount] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [monthlyRent, setMonthlyRent] = useState<number>(0);

  const result = calculateCommission(type, amount, deposit, monthlyRent);
  const rateTable = getCommissionRateTable();

  const quickButtons = [100000000, 300000000, 500000000, 1000000000];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">중개수수료 계산기</h1>
            <p className="text-sm text-text-secondary">서울시 조례 기준 계산</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 계산기 */}
          <div className="bg-white p-6 rounded-xl border border-border">
            <h2 className="font-semibold text-lg mb-4">계산하기</h2>

            {/* 탭 */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setType('sale')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  type === 'sale' ? 'bg-primary text-white' : 'bg-sidebar border border-border'
                }`}
              >
                매매
              </button>
              <button
                onClick={() => setType('lease')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  type === 'lease' ? 'bg-primary text-white' : 'bg-sidebar border border-border'
                }`}
              >
                전세
              </button>
              <button
                onClick={() => setType('monthly')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  type === 'monthly' ? 'bg-primary text-white' : 'bg-sidebar border border-border'
                }`}
              >
                월세
              </button>
            </div>

            {/* 입력 */}
            {type === 'monthly' ? (
              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">보증금</label>
                  <input
                    type="number"
                    value={deposit || ''}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    placeholder="보증금을 입력하세요"
                    className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">월세</label>
                  <input
                    type="number"
                    value={monthlyRent || ''}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    placeholder="월세를 입력하세요"
                    className="w-full px-4 py-3 border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  {type === 'sale' ? '매매가' : '전세금'}
                </label>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="금액을 입력하세요"
                  className="w-full px-4 py-3 border border-input-border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="grid grid-cols-4 gap-2">
                  {quickButtons.map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className="px-3 py-2 text-sm bg-sidebar border border-border rounded-lg hover:bg-sidebar-hover transition-colors"
                    >
                      {val / 100000000}억
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 결과 */}
            {(amount > 0 || (type === 'monthly' && deposit > 0)) && (
              <div className="bg-primary-light p-4 rounded-lg space-y-3">
                {type === 'monthly' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">환산 보증금</span>
                    <span className="font-semibold">{formatCurrency(result.baseAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">적용 요율</span>
                  <span className="font-semibold">{result.rate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">중개수수료</span>
                  <span className="font-semibold">{formatCurrency(result.commission)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">부가세(10%)</span>
                  <span className="font-semibold">{formatCurrency(result.vat)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-primary/20">
                  <span className="font-bold">총 비용</span>
                  <span className="font-bold text-primary text-xl">{formatCurrency(result.total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* 요율표 */}
          <div className="bg-white p-6 rounded-xl border border-border">
            <h2 className="font-semibold text-lg mb-4">서울시 중개수수료 요율표</h2>
            <div className="space-y-3">
              {rateTable.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-sidebar rounded-lg border border-border"
                >
                  <div className="font-medium text-sm mb-1">{item.range}</div>
                  <div className="text-primary font-bold">{item.rate}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="text-sm text-text-secondary">
                <strong className="text-accent">💡 참고사항</strong>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• 월세의 경우: 보증금 + (월세 × 100) = 환산 보증금</li>
                  <li>• 부가세 10%는 수수료에 별도 부과</li>
                  <li>• 요율 범위 내에서 협의 가능</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
