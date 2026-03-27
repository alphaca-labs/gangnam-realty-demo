// 서울시 조례 기준 중개수수료 계산

export type TransactionType = 'sale' | 'lease' | 'monthly';

interface CommissionRate {
  min: number;
  max: number;
  rate: number;
  limit: number;
  label: string;
}

// 서울시 조례 기준 매매 요율표
const SALE_RATES: CommissionRate[] = [
  { min: 0, max: 50000000, rate: 0.6, limit: 250000, label: '5천만원 미만' },
  { min: 50000000, max: 200000000, rate: 0.5, limit: 800000, label: '5천만원~2억 미만' },
  { min: 200000000, max: 900000000, rate: 0.4, limit: 0, label: '2억~9억 미만' },
  { min: 900000000, max: 1200000000, rate: 0.5, limit: 0, label: '9억~12억 미만' },
  { min: 1200000000, max: 1500000000, rate: 0.6, limit: 0, label: '12억~15억 미만' },
  { min: 1500000000, max: Infinity, rate: 0.7, limit: 0, label: '15억 이상' },
];

// 서울시 조례 기준 전세 요율표
const LEASE_RATES: CommissionRate[] = [
  { min: 0, max: 50000000, rate: 0.5, limit: 200000, label: '5천만원 미만' },
  { min: 50000000, max: 100000000, rate: 0.4, limit: 300000, label: '5천만원~1억 미만' },
  { min: 100000000, max: 600000000, rate: 0.3, limit: 0, label: '1억~6억 미만' },
  { min: 600000000, max: 1200000000, rate: 0.4, limit: 0, label: '6억~12억 미만' },
  { min: 1200000000, max: 1500000000, rate: 0.5, limit: 0, label: '12억~15억 미만' },
  { min: 1500000000, max: Infinity, rate: 0.6, limit: 0, label: '15억 이상' },
];

function getRates(type: TransactionType): CommissionRate[] {
  return type === 'sale' ? SALE_RATES : LEASE_RATES;
}

export function calculateCommission(type: TransactionType, amount: number, monthlyRent?: number) {
  // 월세인 경우 환산보증금 계산
  let calculationAmount = amount;
  if (type === 'monthly' && monthlyRent) {
    calculationAmount = amount + (monthlyRent * 100);
  }

  const rates = getRates(type === 'monthly' ? 'lease' : type);
  const bracket = rates.find(r => calculationAmount >= r.min && calculationAmount < r.max);

  if (!bracket) return { rate: 0, commission: 0, vat: 0, total: 0, bracket: '' };

  const rate = bracket.rate;
  let commission = Math.floor(calculationAmount * (rate / 100));

  // 한도 적용
  if (bracket.limit > 0) {
    commission = Math.min(commission, bracket.limit);
  }

  const vat = Math.floor(commission * 0.1);
  const total = commission + vat;

  return {
    rate,
    commission,
    vat,
    total,
    bracket: bracket.label,
    convertedAmount: type === 'monthly' ? calculationAmount : undefined,
  };
}

export function formatKoreanWon(amount: number): string {
  if (amount >= 100000000) {
    const eok = Math.floor(amount / 100000000);
    const man = Math.floor((amount % 100000000) / 10000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
  }
  if (amount >= 10000) {
    return `${Math.floor(amount / 10000).toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export const RATE_TABLE = {
  sale: SALE_RATES,
  lease: LEASE_RATES,
};
