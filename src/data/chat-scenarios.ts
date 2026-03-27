export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  richContent?: {
    type: 'chart' | 'table' | 'guide' | 'calculator' | 'checklist';
    data?: any;
  };
}

export const scenarios: Record<string, ChatMessage[]> = {
  '압구정동 실거래가': [
    {
      role: 'user',
      content: '압구정동 실거래가',
    },
    {
      role: 'assistant',
      content: '압구정동의 최근 6개월 실거래가 추이를 보여드리겠습니다.',
      richContent: {
        type: 'chart',
        data: {
          title: '압구정동 아파트 실거래가 추이',
          chartData: [
            { month: '2025-09', price: 220000 },
            { month: '2025-10', price: 225000 },
            { month: '2025-11', price: 230000 },
            { month: '2025-12', price: 235000 },
            { month: '2026-01', price: 240000 },
            { month: '2026-02', price: 245000 },
          ],
          transactions: [
            { date: '2026-02-15', complex: '압구정 현대', area: '84㎡', price: 250000, floor: 15 },
            { date: '2026-02-10', complex: '압구정 한양', area: '84㎡', price: 240000, floor: 8 },
            { date: '2026-01-28', complex: '압구정 SK뷰', area: '84㎡', price: 245000, floor: 20 },
            { date: '2026-01-15', complex: '압구정 롯데캐슬', area: '84㎡', price: 238000, floor: 12 },
          ],
        },
      },
    },
  ],
  '중개수수료': [
    {
      role: 'user',
      content: '중개수수료 얼마인가요?',
    },
    {
      role: 'assistant',
      content: '중개수수료를 계산해 드리겠습니다. 거래 금액을 입력해주세요.',
      richContent: {
        type: 'calculator',
      },
    },
  ],
  '전세사기 예방': [
    {
      role: 'user',
      content: '전세사기 예방 방법',
    },
    {
      role: 'assistant',
      content: '전세사기를 예방하기 위한 필수 체크리스트입니다.',
      richContent: {
        type: 'checklist',
        data: {
          title: '전세사기 예방 8단계',
          items: [
            '① 등기부등본 필수 확인 (근저당, 가압류 등)',
            '② 집주인 신분 확인 (신분증, 인감증명서)',
            '③ 전입신고 + 확정일자 당일 받기',
            '④ 보증보험 가입 검토',
            '⑤ 임대차 3개월분 이상 연체 확인',
            '⑥ 건물 실소유주 확인 (대리인 계약 주의)',
            '⑦ 계약서 특약사항 꼼꼼히 확인',
            '⑧ 전세금반환보증보험 가입',
          ],
        },
      },
    },
  ],
  '거래신고 방법': [
    {
      role: 'user',
      content: '부동산 거래신고 어떻게 하나요?',
    },
    {
      role: 'assistant',
      content: '부동산 거래신고는 다음 절차로 진행됩니다.',
      richContent: {
        type: 'guide',
        data: {
          title: '부동산 거래신고 절차',
          steps: [
            {
              step: 1,
              title: '계약 체결',
              description: '매매계약서 작성 (매도인·매수인·중개인 서명)',
            },
            {
              step: 2,
              title: '신고서 작성',
              description: '부동산거래신고서 작성 (국토부 누리집 또는 중개사무소)',
            },
            {
              step: 3,
              title: '신고 제출',
              description: '계약일로부터 30일 이내 관할 시·군·구청 제출',
            },
            {
              step: 4,
              title: '검토 및 확인',
              description: '담당 공무원 검토 (1~2일 소요)',
            },
            {
              step: 5,
              title: '신고필증 발급',
              description: '신고필증 수령 (잔금 지급 시 필요)',
            },
          ],
        },
      },
    },
  ],
};

export const suggestionCards = [
  { title: '압구정동 실거래가', icon: '📊' },
  { title: '중개수수료 얼마인가요', icon: '🧮' },
  { title: '전세사기 예방 방법', icon: '⚠️' },
  { title: '거래신고 절차', icon: '📑' },
];
