"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateCommission, type TransactionType, type CalculationResult } from "@/lib/calculator";
import { formatWon, formatInputNumber, parseInputNumber } from "@/lib/format";
import { saleRates, leaseRates } from "@/data/commission-rates";

const quickAmounts = [
  { label: "1억", value: 100000000 },
  { label: "3억", value: 300000000 },
  { label: "5억", value: 500000000 },
  { label: "10억", value: 1000000000 },
];

export default function CalculatorPage() {
  const [type, setType] = useState<TransactionType>("매매");
  const [amountStr, setAmountStr] = useState("");
  const [depositStr, setDepositStr] = useState("");
  const [rentStr, setRentStr] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showRates, setShowRates] = useState(false);

  const handleCalculate = useCallback(() => {
    const amount = parseInputNumber(amountStr);
    if (!amount) return;

    if (type === "월세") {
      const deposit = parseInputNumber(depositStr);
      const rent = parseInputNumber(rentStr);
      setResult(calculateCommission(type, deposit + rent * 100, deposit, rent));
    } else {
      setResult(calculateCommission(type, amount));
    }
  }, [type, amountStr, depositStr, rentStr]);

  const handleQuickAmount = (value: number) => {
    setAmountStr(value.toLocaleString());
  };

  const handleAmountChange = (value: string, setter: (v: string) => void) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    setter(cleaned ? formatInputNumber(cleaned) : "");
  };

  const rates = type === "매매" ? saleRates : leaseRates;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gangnam-primary/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-gangnam-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gangnam-text">중개수수료 계산기</h1>
          <p className="text-sm text-gangnam-sub">서울특별시 조례 기준</p>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-5">
          {/* Transaction Type */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gangnam-text mb-2 block">거래유형</label>
            <Tabs value={type} onValueChange={(v) => { setType(v as TransactionType); setResult(null); }}>
              <TabsList className="w-full">
                <TabsTrigger value="매매" className="flex-1">매매</TabsTrigger>
                <TabsTrigger value="전세" className="flex-1">전세</TabsTrigger>
                <TabsTrigger value="월세" className="flex-1">월세</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Amount Input */}
          {type !== "월세" ? (
            <div className="mb-5">
              <label className="text-sm font-medium text-gangnam-text mb-2 block">
                거래금액
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountStr}
                  onChange={(e) => handleAmountChange(e.target.value, setAmountStr)}
                  placeholder="금액을 입력하세요"
                  className="w-full px-4 py-3 pr-10 border border-border rounded-xl text-base outline-none focus:border-gangnam-primary transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gangnam-sub">원</span>
              </div>
              <div className="flex gap-2 mt-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => handleQuickAmount(q.value)}
                    className="flex-1 py-2 text-xs font-medium bg-gangnam-bg border border-border rounded-lg hover:bg-gangnam-primary/5 hover:border-gangnam-primary/30 transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="text-sm font-medium text-gangnam-text mb-2 block">보증금</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={depositStr}
                    onChange={(e) => handleAmountChange(e.target.value, setDepositStr)}
                    placeholder="보증금을 입력하세요"
                    className="w-full px-4 py-3 pr-10 border border-border rounded-xl text-base outline-none focus:border-gangnam-primary transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gangnam-sub">원</span>
                </div>
              </div>
              <div className="mb-5">
                <label className="text-sm font-medium text-gangnam-text mb-2 block">월세</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={rentStr}
                    onChange={(e) => handleAmountChange(e.target.value, setRentStr)}
                    placeholder="월세를 입력하세요"
                    className="w-full px-4 py-3 pr-10 border border-border rounded-xl text-base outline-none focus:border-gangnam-primary transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gangnam-sub">원</span>
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleCalculate}
            className="w-full py-3.5 bg-gangnam-primary text-white rounded-xl font-medium hover:bg-gangnam-primary/90 transition-colors text-base"
          >
            계산하기
          </button>
        </CardContent>
      </Card>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4 border-gangnam-primary/20">
              <CardContent className="p-5">
                <h2 className="font-bold text-gangnam-text mb-4 flex items-center gap-2">
                  계산 결과
                  <Badge className="bg-gangnam-primary text-white">{type}</Badge>
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gangnam-sub">상한 요율</span>
                    <span className="font-medium text-gangnam-text">{result.rate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gangnam-sub">중개보수 상한</span>
                    <span className="font-medium text-gangnam-text">
                      {formatWon(result.commission)}
                      {result.limitApplied && (
                        <span className="text-xs text-gangnam-accent ml-1">(한도 적용)</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gangnam-sub">부가세 (10%)</span>
                    <span className="font-medium text-gangnam-text">{formatWon(result.vat)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gangnam-text">최대 총 비용</span>
                      <span className="text-xl font-bold text-gangnam-primary">{formatWon(result.total)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gangnam-sub">
                  <p className="flex items-center gap-1 font-medium text-gangnam-primary mb-1">
                    <Info className="w-3.5 h-3.5" /> 서울특별시 조례 기준
                  </p>
                  <p>{result.rateLabel}: {result.rate}% 이내{result.hasLimit ? ` (한도 ${formatWon(result.commission)})` : ""}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rate Table */}
      <Card>
        <CardContent className="p-5">
          <button
            onClick={() => setShowRates(!showRates)}
            className="w-full flex items-center justify-between text-sm font-medium text-gangnam-text"
          >
            <span>📋 {type === "매매" ? "매매" : "전세/월세"} 요율표 참고</span>
            <span className="text-gangnam-sub text-xs">{showRates ? "접기 ▲" : "펼치기 ▼"}</span>
          </button>
          <AnimatePresence>
            {showRates && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <table className="w-full text-sm mt-3">
                  <thead>
                    <tr className="border-b text-gangnam-sub">
                      <th className="text-left py-2">거래금액</th>
                      <th className="text-right py-2">상한요율</th>
                      <th className="text-right py-2">한도액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((r) => (
                      <tr key={r.label} className="border-b border-border/50">
                        <td className="py-2 text-gangnam-text">{r.label}</td>
                        <td className="py-2 text-right font-medium">{r.rate}%</td>
                        <td className="py-2 text-right text-gangnam-sub">
                          {r.limit ? formatWon(r.limit) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
