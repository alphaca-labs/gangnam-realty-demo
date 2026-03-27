export interface Transaction {
  id: number;
  dong: string;
  complex: string;
  area: number;
  floor: number;
  price: number;
  date: string;
  type: string;
}

export const transactions: Transaction[] = [
  { id: 1, dong: '압구정동', complex: '현대아파트', area: 84.9, floor: 12, price: 320000, date: '2025-01', type: '매매' },
  { id: 2, dong: '압구정동', complex: '현대아파트', area: 84.9, floor: 8, price: 310000, date: '2025-02', type: '매매' },
  { id: 3, dong: '압구정동', complex: '현대아파트', area: 109, floor: 15, price: 420000, date: '2025-03', type: '매매' },
  { id: 4, dong: '압구정동', complex: '신현대아파트', area: 76.5, floor: 5, price: 270000, date: '2025-01', type: '매매' },
  { id: 5, dong: '압구정동', complex: '신현대아파트', area: 76.5, floor: 10, price: 285000, date: '2025-02', type: '매매' },
  { id: 6, dong: '대치동', complex: '래미안대치팰리스', area: 84.9, floor: 18, price: 285000, date: '2025-01', type: '매매' },
  { id: 7, dong: '대치동', complex: '래미안대치팰리스', area: 84.9, floor: 22, price: 295000, date: '2025-02', type: '매매' },
  { id: 8, dong: '대치동', complex: '래미안대치팰리스', area: 114, floor: 10, price: 380000, date: '2025-03', type: '매매' },
  { id: 9, dong: '대치동', complex: '은마아파트', area: 76.8, floor: 7, price: 275000, date: '2025-01', type: '매매' },
  { id: 10, dong: '대치동', complex: '은마아파트', area: 76.8, floor: 14, price: 282000, date: '2025-02', type: '매매' },
  { id: 11, dong: '대치동', complex: '은마아파트', area: 76.8, floor: 3, price: 260000, date: '2025-03', type: '매매' },
  { id: 12, dong: '삼성동', complex: '아이파크삼성', area: 59.9, floor: 25, price: 235000, date: '2025-01', type: '매매' },
  { id: 13, dong: '삼성동', complex: '아이파크삼성', area: 84.7, floor: 30, price: 315000, date: '2025-02', type: '매매' },
  { id: 14, dong: '삼성동', complex: '힐스테이트삼성', area: 84.9, floor: 20, price: 280000, date: '2025-01', type: '매매' },
  { id: 15, dong: '삼성동', complex: '힐스테이트삼성', area: 114, floor: 15, price: 365000, date: '2025-03', type: '매매' },
  { id: 16, dong: '역삼동', complex: '개나리래미안', area: 59.5, floor: 8, price: 175000, date: '2025-01', type: '매매' },
  { id: 17, dong: '역삼동', complex: '개나리래미안', area: 84.9, floor: 12, price: 225000, date: '2025-02', type: '매매' },
  { id: 18, dong: '역삼동', complex: '역삼자이', area: 84.9, floor: 16, price: 240000, date: '2025-01', type: '매매' },
  { id: 19, dong: '역삼동', complex: '역삼자이', area: 59.5, floor: 20, price: 185000, date: '2025-03', type: '매매' },
  { id: 20, dong: '도곡동', complex: '도곡렉슬', area: 84.9, floor: 14, price: 260000, date: '2025-01', type: '매매' },
  { id: 21, dong: '도곡동', complex: '도곡렉슬', area: 114, floor: 8, price: 345000, date: '2025-02', type: '매매' },
  { id: 22, dong: '도곡동', complex: '타워팰리스', area: 162, floor: 35, price: 580000, date: '2025-01', type: '매매' },
  { id: 23, dong: '도곡동', complex: '타워팰리스', area: 132, floor: 40, price: 520000, date: '2025-03', type: '매매' },
  { id: 24, dong: '청담동', complex: '청담자이', area: 84.9, floor: 18, price: 340000, date: '2025-01', type: '매매' },
  { id: 25, dong: '청담동', complex: '청담자이', area: 109, floor: 22, price: 425000, date: '2025-02', type: '매매' },
  { id: 26, dong: '청담동', complex: '더펜트하우스청담', area: 200, floor: 45, price: 850000, date: '2025-01', type: '매매' },
  { id: 27, dong: '개포동', complex: '래미안블레스티지', area: 84.9, floor: 20, price: 265000, date: '2025-01', type: '매매' },
  { id: 28, dong: '개포동', complex: '래미안블레스티지', area: 59.5, floor: 12, price: 195000, date: '2025-02', type: '매매' },
  { id: 29, dong: '개포동', complex: '디에이치아너힐즈', area: 84.9, floor: 25, price: 275000, date: '2025-03', type: '매매' },
  { id: 30, dong: '개포동', complex: '디에이치아너힐즈', area: 114, floor: 18, price: 360000, date: '2025-01', type: '매매' },
  { id: 31, dong: '일원동', complex: '래미안일원', area: 84.9, floor: 10, price: 220000, date: '2025-01', type: '매매' },
  { id: 32, dong: '일원동', complex: '래미안일원', area: 59.5, floor: 7, price: 170000, date: '2025-02', type: '매매' },
  { id: 33, dong: '수서동', complex: '수서신동아', area: 84.9, floor: 5, price: 180000, date: '2025-01', type: '매매' },
  { id: 34, dong: '수서동', complex: '수서신동아', area: 109, floor: 12, price: 235000, date: '2025-03', type: '매매' },
  { id: 35, dong: '논현동', complex: '논현아이파크', area: 59.9, floor: 15, price: 195000, date: '2025-01', type: '매매' },
  { id: 36, dong: '논현동', complex: '논현아이파크', area: 84.9, floor: 20, price: 260000, date: '2025-02', type: '매매' },
  { id: 37, dong: '압구정동', complex: '현대아파트', area: 145, floor: 20, price: 520000, date: '2024-10', type: '매매' },
  { id: 38, dong: '압구정동', complex: '현대아파트', area: 84.9, floor: 10, price: 305000, date: '2024-11', type: '매매' },
  { id: 39, dong: '압구정동', complex: '현대아파트', area: 84.9, floor: 6, price: 300000, date: '2024-12', type: '매매' },
  { id: 40, dong: '대치동', complex: '래미안대치팰리스', area: 84.9, floor: 15, price: 278000, date: '2024-10', type: '매매' },
  { id: 41, dong: '대치동', complex: '래미안대치팰리스', area: 114, floor: 8, price: 370000, date: '2024-11', type: '매매' },
  { id: 42, dong: '대치동', complex: '은마아파트', area: 76.8, floor: 9, price: 268000, date: '2024-10', type: '매매' },
  { id: 43, dong: '대치동', complex: '은마아파트', area: 76.8, floor: 11, price: 272000, date: '2024-11', type: '매매' },
  { id: 44, dong: '대치동', complex: '은마아파트', area: 76.8, floor: 5, price: 255000, date: '2024-12', type: '매매' },
  { id: 45, dong: '삼성동', complex: '아이파크삼성', area: 59.9, floor: 20, price: 228000, date: '2024-11', type: '매매' },
  { id: 46, dong: '삼성동', complex: '아이파크삼성', area: 84.7, floor: 28, price: 308000, date: '2024-12', type: '매매' },
  { id: 47, dong: '역삼동', complex: '개나리래미안', area: 59.5, floor: 6, price: 168000, date: '2024-10', type: '매매' },
  { id: 48, dong: '역삼동', complex: '역삼자이', area: 84.9, floor: 14, price: 232000, date: '2024-11', type: '매매' },
  { id: 49, dong: '도곡동', complex: '도곡렉슬', area: 84.9, floor: 10, price: 252000, date: '2024-10', type: '매매' },
  { id: 50, dong: '도곡동', complex: '타워팰리스', area: 162, floor: 38, price: 570000, date: '2024-11', type: '매매' },
  { id: 51, dong: '청담동', complex: '청담자이', area: 84.9, floor: 15, price: 332000, date: '2024-12', type: '매매' },
  { id: 52, dong: '개포동', complex: '래미안블레스티지', area: 84.9, floor: 18, price: 258000, date: '2024-10', type: '매매' },
  { id: 53, dong: '개포동', complex: '디에이치아너힐즈', area: 84.9, floor: 22, price: 270000, date: '2024-11', type: '매매' },
];

export const dongList = [...new Set(transactions.map(t => t.dong))].sort();
export const complexList = [...new Set(transactions.map(t => t.complex))].sort();

export function getComplexesByDong(dong: string): string[] {
  return [...new Set(transactions.filter(t => t.dong === dong).map(t => t.complex))].sort();
}

// 차트용 월별 평균가 데이터
export function getMonthlyAvgByDong(dong: string) {
  const filtered = transactions.filter(t => t.dong === dong);
  const monthMap = new Map<string, { sum: number; count: number }>();

  filtered.forEach(t => {
    const existing = monthMap.get(t.date) || { sum: 0, count: 0 };
    monthMap.set(t.date, { sum: existing.sum + t.price, count: existing.count + 1 });
  });

  return Array.from(monthMap.entries())
    .map(([date, { sum, count }]) => ({
      date,
      avgPrice: Math.round(sum / count),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// 통계 카드용 데이터
export function getStatsByDong(dong: string) {
  const filtered = transactions.filter(t => t.dong === dong);
  const prices = filtered.map(t => t.price);
  return {
    count: filtered.length,
    avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    max: Math.max(...prices),
    min: Math.min(...prices),
  };
}
