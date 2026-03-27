export const commissionRateInfo = {
  sale: {
    title: '매매 중개수수료 요율표 (서울시 조례)',
    rates: [
      { range: '5천만원 미만', rate: '0.6%', limit: '25만원' },
      { range: '5천만원~2억 미만', rate: '0.5%', limit: '80만원' },
      { range: '2억~9억 미만', rate: '0.4%', limit: '없음' },
      { range: '9억~12억 미만', rate: '0.5%', limit: '없음' },
      { range: '12억~15억 미만', rate: '0.6%', limit: '없음' },
      { range: '15억 이상', rate: '0.7%', limit: '없음' },
    ],
  },
  lease: {
    title: '전세/월세 중개수수료 요율표 (서울시 조례)',
    rates: [
      { range: '5천만원 미만', rate: '0.5%', limit: '20만원' },
      { range: '5천만원~1억 미만', rate: '0.4%', limit: '30만원' },
      { range: '1억~6억 미만', rate: '0.3%', limit: '없음' },
      { range: '6억~12억 미만', rate: '0.4%', limit: '없음' },
      { range: '12억~15억 미만', rate: '0.5%', limit: '없음' },
      { range: '15억 이상', rate: '0.6%', limit: '없음' },
    ],
  },
};
