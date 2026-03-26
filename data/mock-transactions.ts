export interface Transaction {
  id: string;
  dong: string;
  complexName: string;
  floor: number;
  area: number;
  price: number; // 만원 단위
  contractDate: string;
  type: "매매" | "전세" | "월세";
  deposit?: number;
  monthlyRent?: number;
}

export const transactions: Transaction[] = [
  // 압구정동
  { id: "1", dong: "압구정동", complexName: "현대아파트 1차", floor: 12, area: 84, price: 285000, contractDate: "2026-03-15", type: "매매" },
  { id: "2", dong: "압구정동", complexName: "현대아파트 1차", floor: 8, area: 115, price: 350000, contractDate: "2026-03-10", type: "매매" },
  { id: "3", dong: "압구정동", complexName: "미성아파트 2차", floor: 6, area: 59, price: 192000, contractDate: "2026-03-12", type: "매매" },
  { id: "4", dong: "압구정동", complexName: "미성아파트 2차", floor: 10, area: 84, price: 248000, contractDate: "2026-03-05", type: "매매" },
  { id: "5", dong: "압구정동", complexName: "한양아파트", floor: 15, area: 109, price: 320000, contractDate: "2026-02-28", type: "매매" },
  { id: "6", dong: "압구정동", complexName: "한양아파트", floor: 3, area: 76, price: 210000, contractDate: "2026-02-20", type: "매매" },
  { id: "7", dong: "압구정동", complexName: "현대아파트 1차", floor: 5, area: 59, price: 195000, contractDate: "2026-02-15", type: "매매" },
  { id: "8", dong: "압구정동", complexName: "현대아파트 1차", floor: 18, area: 115, price: 380000, contractDate: "2026-01-20", type: "매매" },
  { id: "9", dong: "압구정동", complexName: "미성아파트 2차", floor: 4, area: 49, price: 158000, contractDate: "2026-01-10", type: "매매" },
  { id: "10", dong: "압구정동", complexName: "한양아파트", floor: 11, area: 84, price: 265000, contractDate: "2025-12-28", type: "매매" },
  { id: "11", dong: "압구정동", complexName: "현대아파트 1차", floor: 7, area: 84, price: 278000, contractDate: "2025-12-15", type: "매매" },
  { id: "12", dong: "압구정동", complexName: "한양아파트", floor: 9, area: 109, price: 315000, contractDate: "2025-12-01", type: "매매" },

  // 압구정동 전세
  { id: "13", dong: "압구정동", complexName: "현대아파트 1차", floor: 6, area: 84, price: 140000, contractDate: "2026-03-08", type: "전세" },
  { id: "14", dong: "압구정동", complexName: "미성아파트 2차", floor: 3, area: 59, price: 85000, contractDate: "2026-02-25", type: "전세" },
  { id: "15", dong: "압구정동", complexName: "한양아파트", floor: 10, area: 76, price: 105000, contractDate: "2026-02-10", type: "전세" },

  // 대치동
  { id: "16", dong: "대치동", complexName: "래미안대치팰리스", floor: 20, area: 84, price: 295000, contractDate: "2026-03-18", type: "매매" },
  { id: "17", dong: "대치동", complexName: "래미안대치팰리스", floor: 15, area: 115, price: 420000, contractDate: "2026-03-12", type: "매매" },
  { id: "18", dong: "대치동", complexName: "은마아파트", floor: 8, area: 76, price: 268000, contractDate: "2026-03-08", type: "매매" },
  { id: "19", dong: "대치동", complexName: "은마아파트", floor: 12, area: 84, price: 290000, contractDate: "2026-03-01", type: "매매" },
  { id: "20", dong: "대치동", complexName: "래미안대치팰리스", floor: 10, area: 59, price: 235000, contractDate: "2026-02-22", type: "매매" },
  { id: "21", dong: "대치동", complexName: "은마아파트", floor: 5, area: 59, price: 218000, contractDate: "2026-02-15", type: "매매" },
  { id: "22", dong: "대치동", complexName: "래미안대치팰리스", floor: 25, area: 134, price: 520000, contractDate: "2026-02-01", type: "매매" },
  { id: "23", dong: "대치동", complexName: "은마아파트", floor: 14, area: 76, price: 275000, contractDate: "2026-01-18", type: "매매" },
  { id: "24", dong: "대치동", complexName: "래미안대치팰리스", floor: 7, area: 84, price: 288000, contractDate: "2025-12-20", type: "매매" },
  { id: "25", dong: "대치동", complexName: "은마아파트", floor: 3, area: 84, price: 260000, contractDate: "2025-12-05", type: "매매" },

  // 대치동 전세
  { id: "26", dong: "대치동", complexName: "래미안대치팰리스", floor: 12, area: 84, price: 150000, contractDate: "2026-03-05", type: "전세" },
  { id: "27", dong: "대치동", complexName: "은마아파트", floor: 6, area: 76, price: 120000, contractDate: "2026-02-18", type: "전세" },

  // 삼성동
  { id: "28", dong: "삼성동", complexName: "아이파크삼성", floor: 30, area: 134, price: 480000, contractDate: "2026-03-14", type: "매매" },
  { id: "29", dong: "삼성동", complexName: "아이파크삼성", floor: 22, area: 84, price: 310000, contractDate: "2026-03-06", type: "매매" },
  { id: "30", dong: "삼성동", complexName: "래미안삼성", floor: 18, area: 115, price: 380000, contractDate: "2026-02-28", type: "매매" },
  { id: "31", dong: "삼성동", complexName: "래미안삼성", floor: 10, area: 84, price: 285000, contractDate: "2026-02-20", type: "매매" },
  { id: "32", dong: "삼성동", complexName: "아이파크삼성", floor: 15, area: 59, price: 240000, contractDate: "2026-02-10", type: "매매" },
  { id: "33", dong: "삼성동", complexName: "래미안삼성", floor: 8, area: 59, price: 215000, contractDate: "2026-01-25", type: "매매" },
  { id: "34", dong: "삼성동", complexName: "아이파크삼성", floor: 28, area: 115, price: 410000, contractDate: "2026-01-15", type: "매매" },
  { id: "35", dong: "삼성동", complexName: "래미안삼성", floor: 5, area: 76, price: 250000, contractDate: "2025-12-28", type: "매매" },

  // 삼성동 전세/월세
  { id: "36", dong: "삼성동", complexName: "아이파크삼성", floor: 20, area: 84, price: 160000, contractDate: "2026-03-01", type: "전세" },
  { id: "37", dong: "삼성동", complexName: "래미안삼성", floor: 12, area: 59, price: 95000, contractDate: "2026-02-15", type: "전세" },
  { id: "38", dong: "삼성동", complexName: "아이파크삼성", floor: 10, area: 59, price: 50000, contractDate: "2026-02-01", type: "월세", deposit: 50000, monthlyRent: 150 },

  // 역삼동
  { id: "39", dong: "역삼동", complexName: "개나리래미안", floor: 14, area: 84, price: 218000, contractDate: "2026-03-16", type: "매매" },
  { id: "40", dong: "역삼동", complexName: "개나리래미안", floor: 8, area: 59, price: 168000, contractDate: "2026-03-08", type: "매매" },
  { id: "41", dong: "역삼동", complexName: "래미안역삼", floor: 20, area: 115, price: 340000, contractDate: "2026-03-02", type: "매매" },
  { id: "42", dong: "역삼동", complexName: "래미안역삼", floor: 12, area: 84, price: 258000, contractDate: "2026-02-25", type: "매매" },
  { id: "43", dong: "역삼동", complexName: "개나리래미안", floor: 6, area: 76, price: 195000, contractDate: "2026-02-15", type: "매매" },
  { id: "44", dong: "역삼동", complexName: "래미안역삼", floor: 15, area: 59, price: 198000, contractDate: "2026-02-05", type: "매매" },
  { id: "45", dong: "역삼동", complexName: "개나리래미안", floor: 10, area: 84, price: 212000, contractDate: "2026-01-20", type: "매매" },
  { id: "46", dong: "역삼동", complexName: "래미안역삼", floor: 8, area: 76, price: 235000, contractDate: "2026-01-10", type: "매매" },
  { id: "47", dong: "역삼동", complexName: "개나리래미안", floor: 3, area: 59, price: 160000, contractDate: "2025-12-20", type: "매매" },

  // 역삼동 전세/월세
  { id: "48", dong: "역삼동", complexName: "래미안역삼", floor: 10, area: 84, price: 120000, contractDate: "2026-03-10", type: "전세" },
  { id: "49", dong: "역삼동", complexName: "개나리래미안", floor: 5, area: 59, price: 75000, contractDate: "2026-02-20", type: "전세" },
  { id: "50", dong: "역삼동", complexName: "래미안역삼", floor: 8, area: 59, price: 30000, contractDate: "2026-01-15", type: "월세", deposit: 30000, monthlyRent: 120 },
];

export const dongs = ["압구정동", "대치동", "삼성동", "역삼동"] as const;
export type Dong = (typeof dongs)[number];

export const complexesByDong: Record<Dong, string[]> = {
  "압구정동": ["현대아파트 1차", "미성아파트 2차", "한양아파트"],
  "대치동": ["래미안대치팰리스", "은마아파트"],
  "삼성동": ["아이파크삼성", "래미안삼성"],
  "역삼동": ["개나리래미안", "래미안역삼"],
};
