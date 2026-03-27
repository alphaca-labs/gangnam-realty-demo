// 중개수수료 계산 로직 (서울시 조례 기준)

export type TransactionType = 'sale' | 'lease' | 'monthly';

interface CommissionRate {
  max: number;
  min: number;
  rate: number;
}

// 매매/전세 요율표
const commissionRates: Record<number, CommissionRate> = {
  50_000_000: { max: 50_000_000, min: 0, rate: 0.006 },
  200_000_000: { max: 200_000_000, min: 50_000_000, rate: 0.005 },
  900_000_000: { max: 900_000_000, min: 200_000_000, rate: 0.004 },
  Infinity: { max: Infinity, min: 900_000_000, rate: 0.009 },
};

// 월세 전환 계산 (보증금 + 월세 * 100)
export function calculateConvertedDeposit(deposit: number, monthlyRent: number): number {
  return deposit + (monthlyRent * 100);
}

export function calculateCommission(
  type: TransactionType,
  amount: number,
  deposit?: number,
  monthlyRent?: number
): {
  baseAmount: number;
  rate: number;
  commission: number;
  vat: number;
  total: number;
} {
  let baseAmount = amount;

  // 월세의 경우 전환 보증금 계산
  if (type === 'monthly' && deposit !== undefined && monthlyRent !== undefined) {
    baseAmount = calculateConvertedDeposit(deposit, monthlyRent);
  }

  // 요율 찾기
  let rate = 0;
  for (const threshold of Object.keys(commissionRates).map(Number).sort((a, b) => a - b)) {
    const rateInfo = commissionRates[threshold];
    if (baseAmount > rateInfo.min && baseAmount <= rateInfo.max) {
      rate = rateInfo.rate;
      break;
    }
  }

  const commission = Math.floor(baseAmount * rate);
  const vat = Math.floor(commission * 0.1);
  const total = commission + vat;

  return {
    baseAmount,
    rate: rate * 100, // 퍼센트로 변환
    commission,
    vat,
    total,
  };
}

// 요율표 반환
export function getCommissionRateTable(): Array<{
  range: string;
  rate: string;
}> {
  return [
    { range: '5천만원 이하', rate: '0.6% 이내' },
    { range: '5천만원 초과 ~ 2억원 이하', rate: '0.5% 이내' },
    { range: '2억원 초과 ~ 9억원 이하', rate: '0.4% 이내' },
    { range: '9억원 초과', rate: '0.9% 이내' },
  ];
}
