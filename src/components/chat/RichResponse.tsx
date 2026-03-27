'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { calculateCommission, TransactionType } from '@/lib/calculator';

interface RichResponseProps {
  content: {
    type: 'chart' | 'table' | 'guide' | 'calculator' | 'checklist';
    data?: any;
  };
}

export default function RichResponse({ content }: RichResponseProps) {
  if (content.type === 'chart') {
    return <ChartResponse data={content.data} />;
  }

  if (content.type === 'calculator') {
    return <CalculatorResponse />;
  }

  if (content.type === 'checklist') {
    return <ChecklistResponse data={content.data} />;
  }

  if (content.type === 'guide') {
    return <GuideResponse data={content.data} />;
  }

  return null;
}

function ChartResponse({ data }: { data: any }) {
  return (
    <div className="mt-4 p-4 bg-sidebar rounded-xl border border-border">
      <h3 className="font-semibold text-lg mb-4">{data.title}</h3>
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => formatCurrency(value * 10000)}
            />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#1B4D8E" strokeWidth={2} name="평균 거래가(만원)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3">거래일</th>
              <th className="text-left py-2 px-3">단지명</th>
              <th className="text-left py-2 px-3">면적</th>
              <th className="text-left py-2 px-3">층</th>
              <th className="text-right py-2 px-3">거래가</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((tx: any, idx: number) => (
              <tr key={idx} className="border-b border-border hover:bg-sidebar-hover">
                <td className="py-2 px-3">{tx.date}</td>
                <td className="py-2 px-3">{tx.complex}</td>
                <td className="py-2 px-3">{tx.area}㎡</td>
                <td className="py-2 px-3">{tx.floor}층</td>
                <td className="py-2 px-3 text-right font-semibold">{formatCurrency(tx.price * 10000)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CalculatorResponse() {
  const [type, setType] = useState<TransactionType>('sale');
  const [amount, setAmount] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [monthlyRent, setMonthlyRent] = useState<number>(0);

  const result = calculateCommission(type, amount, deposit, monthlyRent);

  const quickButtons = [100000000, 300000000, 500000000, 1000000000];

  return (
    <div className="mt-4 p-4 bg-sidebar rounded-xl border border-border">
      <h3 className="font-semibold text-lg mb-4">중개수수료 계산기</h3>
      
      {/* 탭 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setType('sale')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            type === 'sale' ? 'bg-primary text-white' : 'bg-white border border-border'
          }`}
        >
          매매
        </button>
        <button
          onClick={() => setType('lease')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            type === 'lease' ? 'bg-primary text-white' : 'bg-white border border-border'
          }`}
        >
          전세
        </button>
        <button
          onClick={() => setType('monthly')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            type === 'monthly' ? 'bg-primary text-white' : 'bg-white border border-border'
          }`}
        >
          월세
        </button>
      </div>

      {/* 입력 */}
      {type === 'monthly' ? (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm mb-1">보증금</label>
            <input
              type="number"
              value={deposit || ''}
              onChange={(e) => setDeposit(Number(e.target.value))}
              placeholder="보증금을 입력하세요"
              className="w-full px-3 py-2 border border-input-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">월세</label>
            <input
              type="number"
              value={monthlyRent || ''}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              placeholder="월세를 입력하세요"
              className="w-full px-3 py-2 border border-input-border rounded-lg"
            />
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm mb-1">
            {type === 'sale' ? '매매가' : '전세금'}
          </label>
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="금액을 입력하세요"
            className="w-full px-3 py-2 border border-input-border rounded-lg mb-2"
          />
          <div className="flex gap-2 flex-wrap">
            {quickButtons.map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className="px-3 py-1 text-sm bg-white border border-border rounded-lg hover:bg-sidebar-hover"
              >
                {val / 100000000}억
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 결과 */}
      {(amount > 0 || (type === 'monthly' && deposit > 0)) && (
        <div className="bg-white p-4 rounded-lg border border-border space-y-2">
          {type === 'monthly' && (
            <div className="flex justify-between text-sm">
              <span>환산 보증금</span>
              <span className="font-semibold">{formatCurrency(result.baseAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>적용 요율</span>
            <span className="font-semibold">{result.rate}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>중개수수료</span>
            <span className="font-semibold">{formatCurrency(result.commission)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>부가세(10%)</span>
            <span className="font-semibold">{formatCurrency(result.vat)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-bold">총 비용</span>
            <span className="font-bold text-primary text-lg">{formatCurrency(result.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ChecklistResponse({ data }: { data: any }) {
  return (
    <div className="mt-4 p-4 bg-sidebar rounded-xl border border-border">
      <h3 className="font-semibold text-lg mb-4">{data.title}</h3>
      <div className="space-y-2">
        {data.items.map((item: string, idx: number) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-accent text-sm">✓</span>
            </div>
            <div className="flex-1 text-sm">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuideResponse({ data }: { data: any }) {
  return (
    <div className="mt-4 p-4 bg-sidebar rounded-xl border border-border">
      <h3 className="font-semibold text-lg mb-4">{data.title}</h3>
      <div className="space-y-4">
        {data.steps.map((step: any, idx: number) => (
          <div key={idx} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
              {step.step}
            </div>
            <div className="flex-1">
              <div className="font-semibold mb-1">{step.title}</div>
              <div className="text-sm text-text-secondary">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
