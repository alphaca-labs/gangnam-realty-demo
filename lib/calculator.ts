import { saleRates, leaseRates, type RateRow } from "@/data/commission-rates";

export type TransactionType = "매매" | "전세" | "월세";

function findRate(price: number, rates: RateRow[]) {
  return rates.find((r) => price >= r.min && price < r.max) ?? rates[rates.length - 1];
}

export interface CalculationResult {
  rate: number;
  commission: number;
  vat: number;
  total: number;
  rateLabel: string;
  hasLimit: boolean;
  limitApplied: boolean;
}

export function calculateCommission(
  type: TransactionType,
  amount: number, // 원 단위
  deposit?: number, // 원 (월세 보증금)
  monthlyRent?: number, // 원 (월세)
): CalculationResult {
  const priceInManwon = amount / 10000;
  let targetPrice: number;
  let rates: RateRow[];

  if (type === "매매") {
    targetPrice = priceInManwon;
    rates = saleRates;
  } else if (type === "전세") {
    targetPrice = priceInManwon;
    rates = leaseRates;
  } else {
    // 월세: 환산보증금 = 보증금 + (월세 × 100)
    const dep = (deposit ?? 0) / 10000;
    const rent = (monthlyRent ?? 0) / 10000;
    targetPrice = dep + rent * 100;
    rates = leaseRates;
  }

  const row = findRate(targetPrice, rates);
  const ratePercent = row.rate;
  let commission = Math.floor(amount * (ratePercent / 100));

  const hasLimit = row.limit !== undefined;
  let limitApplied = false;

  if (hasLimit && commission > row.limit!) {
    commission = row.limit!;
    limitApplied = true;
  }

  const vat = Math.floor(commission * 0.1);
  const total = commission + vat;

  return {
    rate: ratePercent,
    commission,
    vat,
    total,
    rateLabel: row.label,
    hasLimit,
    limitApplied,
  };
}
