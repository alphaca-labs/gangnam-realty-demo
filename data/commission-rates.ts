export interface RateRow {
  min: number;       // 만원
  max: number;       // 만원 (Infinity for open-ended)
  rate: number;      // %
  limit?: number;    // 한도 (원)
  label: string;
}

export const saleRates: RateRow[] = [
  { min: 0,      max: 5000,     rate: 0.6, limit: 250000,   label: "5천만원 미만" },
  { min: 5000,   max: 20000,    rate: 0.5, limit: 800000,   label: "5천만~2억 미만" },
  { min: 20000,  max: 90000,    rate: 0.4,                  label: "2억~9억 미만" },
  { min: 90000,  max: 120000,   rate: 0.5,                  label: "9억~12억 미만" },
  { min: 120000, max: 150000,   rate: 0.6,                  label: "12억~15억 미만" },
  { min: 150000, max: Infinity, rate: 0.7,                  label: "15억 이상" },
];

export const leaseRates: RateRow[] = [
  { min: 0,      max: 5000,     rate: 0.5, limit: 200000,   label: "5천만원 미만" },
  { min: 5000,   max: 10000,    rate: 0.4, limit: 300000,   label: "5천만~1억 미만" },
  { min: 10000,  max: 60000,    rate: 0.3,                  label: "1억~6억 미만" },
  { min: 60000,  max: 120000,   rate: 0.4,                  label: "6억~12억 미만" },
  { min: 120000, max: 150000,   rate: 0.5,                  label: "12억~15억 미만" },
  { min: 150000, max: Infinity, rate: 0.6,                  label: "15억 이상" },
];
