'use client';

import { useState, useMemo } from 'react';
import { Calculator, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { calculateCommission, formatKoreanWon, type TransactionType, RATE_TABLE } from '@/lib/calculator';
import { commissionRateInfo } from '@/data/commission-rates';
import { cn } from '@/lib/utils';

const TAB_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: 'sale', label: '매매' },
  { value: 'lease', label: '전세' },
  { value: 'monthly', label: '월세' },
];

const QUICK_AMOUNTS = [
  { label: '1억', value: 100000000 },
  { label: '3억', value: 300000000 },
  { label: '5억', value: 500000000 },
  { label: '10억', value: 1000000000 },
  { label: '15억', value: 1500000000 },
  { label: '20억', value: 2000000000 },
];

function formatInputDisplay(value: number): string {
  if (value === 0) return '';
  return value.toLocaleString('ko-KR');
}

function parseInputValue(raw: string): number {
  const cleaned = raw.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export default function CalculatorPage() {
  const [transactionType, setTransactionType] = useState<TransactionType>('sale');
  const [amount, setAmount] = useState<number>(0);
  const [monthlyRent, setMonthlyRent] = useState<number>(0);
  const [rateTableOpen, setRateTableOpen] = useState(false);

  const result = useMemo(() => {
    if (amount === 0 && (transactionType !== 'monthly' || monthlyRent === 0)) {
      return null;
    }
    return calculateCommission(transactionType, amount, monthlyRent);
  }, [transactionType, amount, monthlyRent]);

  function handleAmountChange(raw: string) {
    setAmount(parseInputValue(raw));
  }

  function handleMonthlyRentChange(raw: string) {
    setMonthlyRent(parseInputValue(raw));
  }

  function handleQuickAmount(value: number) {
    setAmount(value);
  }

  function handleTabChange(type: TransactionType) {
    setTransactionType(type);
    setAmount(0);
    setMonthlyRent(0);
  }

  const rateInfo = transactionType === 'sale'
    ? commissionRateInfo.sale
    : commissionRateInfo.lease;

  return (
    <div className="flex-1 overflow-y-auto pt-14 lg:pt-0">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
            <Calculator className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            중개수수료 계산기
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            서울시 조례 기준으로 정확하게 계산합니다
          </p>
        </div>

        {/* Transaction Type Tabs */}
        <div className="mb-6">
          <div className="flex rounded-xl bg-muted p-1">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={cn(
                  'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all',
                  transactionType === tab.value
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input Card */}
        <div className="mb-6 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            {transactionType === 'monthly' ? '보증금' : '거래금액'}
          </label>
          <div className="relative mb-4">
            <input
              type="text"
              inputMode="numeric"
              value={formatInputDisplay(amount)}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="금액을 입력하세요"
              className="h-14 w-full rounded-xl border border-input bg-white px-4 pr-12 text-xl font-semibold text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-2xl"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              원
            </span>
          </div>
          {amount > 0 && (
            <p className="mb-4 text-sm text-primary font-medium">
              = {formatKoreanWon(amount)}
            </p>
          )}

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((qa) => (
              <button
                key={qa.value}
                onClick={() => handleQuickAmount(qa.value)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                  amount === qa.value
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-border bg-white text-muted-foreground hover:border-primary/30 hover:bg-primary-light/50 hover:text-foreground'
                )}
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Monthly Rent Input */}
          {transactionType === 'monthly' && (
            <div className="mt-5 border-t border-border pt-5">
              <label className="mb-2 block text-sm font-medium text-foreground">
                월세
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatInputDisplay(monthlyRent)}
                  onChange={(e) => handleMonthlyRentChange(e.target.value)}
                  placeholder="월세 금액을 입력하세요"
                  className="h-14 w-full rounded-xl border border-input bg-white px-4 pr-16 text-xl font-semibold text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-2xl"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  원/월
                </span>
              </div>
              {monthlyRent > 0 && (
                <p className="mt-2 text-sm text-primary font-medium">
                  = {formatKoreanWon(monthlyRent)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Calculation Result Card */}
        {result && result.commission > 0 && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white to-primary-light shadow-sm">
            <div className="border-b border-border/50 bg-white/60 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-foreground">
                계산 결과
              </h2>
            </div>
            <div className="px-5 py-5 sm:px-6">
              {/* Converted Amount for Monthly Rent */}
              {transactionType === 'monthly' && result.convertedAmount && (
                <div className="mb-4 flex items-center justify-between rounded-xl bg-white/80 px-4 py-3">
                  <span className="text-sm text-muted-foreground">환산보증금</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatKoreanWon(result.convertedAmount)}
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {/* Rate */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">적용 요율</span>
                  <span className="text-sm font-semibold text-foreground">
                    {result.rate}%
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      ({result.bracket})
                    </span>
                  </span>
                </div>

                {/* Commission */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">중개수수료</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatKoreanWon(result.commission)}
                  </span>
                </div>

                {/* VAT */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">부가세 (10%)</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatKoreanWon(result.vat)}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-border/60" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">총 비용</span>
                  <span className="text-xl font-bold text-accent sm:text-2xl">
                    {formatKoreanWon(result.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State when no amount entered */}
        {(!result || result.commission === 0) && (
          <div className="mb-6 rounded-2xl border border-dashed border-border bg-muted/30 px-5 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              금액을 입력하면 수수료가 자동으로 계산됩니다
            </p>
          </div>
        )}

        {/* Rate Table Accordion */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <button
            onClick={() => setRateTableOpen(!rateTableOpen)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/30 sm:px-6"
          >
            <span className="text-sm font-semibold text-foreground">
              {rateInfo.title}
            </span>
            {rateTableOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {rateTableOpen && (
            <div className="border-t border-border px-5 pb-5 pt-3 sm:px-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 pr-4 text-left font-medium text-muted-foreground">
                        거래금액
                      </th>
                      <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">
                        요율
                      </th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">
                        한도액
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateInfo.rates.map((row, idx) => (
                      <tr
                        key={idx}
                        className={cn(
                          'border-b border-border/50 last:border-0',
                          result && result.bracket === row.range
                            ? 'bg-primary-light/50 font-medium'
                            : ''
                        )}
                      >
                        <td className="py-2.5 pr-4 text-foreground">
                          {row.range}
                        </td>
                        <td className="py-2.5 pr-4 text-right text-foreground">
                          {row.rate}
                        </td>
                        <td className="py-2.5 text-right text-foreground">
                          {row.limit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Info Note */}
        <div className="mb-8 flex items-start gap-2.5 rounded-xl bg-muted/50 px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            * 서울시 조례 기준이며, 실제 수수료는 중개사와 협의 가능합니다.
            부가세는 간이과세자의 경우 면제될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
