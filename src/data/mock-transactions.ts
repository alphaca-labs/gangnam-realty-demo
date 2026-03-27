export interface Transaction {
  id: string;
  date: string;
  dong: string;
  complex: string;
  area: number;
  floor: number;
  price: number;
  type: '매매' | '전세' | '월세';
}

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2026-02-20', dong: '압구정동', complex: '압구정 현대', area: 84, floor: 15, price: 250000, type: '매매' },
  { id: '2', date: '2026-02-18', dong: '압구정동', complex: '압구정 한양', area: 84, floor: 8, price: 240000, type: '매매' },
  { id: '3', date: '2026-02-15', dong: '압구정동', complex: '압구정 SK뷰', area: 84, floor: 20, price: 245000, type: '매매' },
  { id: '4', date: '2026-02-10', dong: '압구정동', complex: '압구정 롯데캐슬', area: 84, floor: 12, price: 238000, type: '매매' },
  { id: '5', date: '2026-02-05', dong: '압구정동', complex: '압구정 자이', area: 84, floor: 18, price: 248000, type: '매매' },
  { id: '6', date: '2026-01-28', dong: '청담동', complex: '청담 IPARK', area: 84, floor: 10, price: 260000, type: '매매' },
  { id: '7', date: '2026-01-25', dong: '청담동', complex: '청담 래미안', area: 84, floor: 22, price: 255000, type: '매매' },
  { id: '8', date: '2026-01-20', dong: '청담동', complex: '청담 롯데캐슬', area: 84, floor: 5, price: 250000, type: '매매' },
  { id: '9', date: '2026-01-15', dong: '삼성동', complex: '삼성 래미안', area: 84, floor: 14, price: 230000, type: '매매' },
  { id: '10', date: '2026-01-10', dong: '삼성동', complex: '삼성 IPARK', area: 84, floor: 16, price: 235000, type: '매매' },
  { id: '11', date: '2026-02-22', dong: '대치동', complex: '은마아파트', area: 84, floor: 9, price: 220000, type: '매매' },
  { id: '12', date: '2026-02-20', dong: '대치동', complex: '대치 래미안', area: 84, floor: 11, price: 225000, type: '매매' },
  { id: '13', date: '2026-02-18', dong: '대치동', complex: '대치 힐스테이트', area: 84, floor: 17, price: 228000, type: '매매' },
  { id: '14', date: '2026-02-15', dong: '도곡동', complex: '도곡 렉슬', area: 84, floor: 13, price: 210000, type: '매매' },
  { id: '15', date: '2026-02-12', dong: '도곡동', complex: '도곡 타워팰리스', area: 84, floor: 25, price: 215000, type: '매매' },
  { id: '16', date: '2026-02-10', dong: '역삼동', complex: '역삼 롯데캐슬', area: 84, floor: 7, price: 205000, type: '매매' },
  { id: '17', date: '2026-02-08', dong: '역삼동', complex: '역삼 래미안', area: 84, floor: 19, price: 208000, type: '매매' },
  { id: '18', date: '2026-02-05', dong: '논현동', complex: '논현 IPARK', area: 84, floor: 6, price: 195000, type: '매매' },
  { id: '19', date: '2026-02-03', dong: '논현동', complex: '논현 자이', area: 84, floor: 21, price: 198000, type: '매매' },
  { id: '20', date: '2026-02-01', dong: '개포동', complex: '개포 주공', area: 84, floor: 4, price: 180000, type: '매매' },
];

export const priceChartData = [
  { month: '2025-09', 압구정동: 220000, 청담동: 245000, 삼성동: 215000, 대치동: 210000 },
  { month: '2025-10', 압구정동: 225000, 청담동: 250000, 삼성동: 220000, 대치동: 215000 },
  { month: '2025-11', 압구정동: 230000, 청담동: 252000, 삼성동: 222000, 대치동: 218000 },
  { month: '2025-12', 압구정동: 235000, 청담동: 255000, 삼성동: 225000, 대치동: 220000 },
  { month: '2026-01', 압구정동: 240000, 청담동: 258000, 삼성동: 228000, 대치동: 222000 },
  { month: '2026-02', 압구정동: 245000, 청담동: 260000, 삼성동: 230000, 대치동: 225000 },
];

export const dongs = ['전체', '압구정동', '청담동', '삼성동', '대치동', '도곡동', '역삼동', '논현동', '개포동'];
