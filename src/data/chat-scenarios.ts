export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  richType?: 'chart' | 'calculator' | 'checklist' | 'steps' | 'default';
}

export interface ChatScenario {
  keywords: string[];
  messages: ChatMessage[];
}

export const scenarios: ChatScenario[] = [
  {
    keywords: ['압구정', '실거래가', '실거래', '압구정동'],
    messages: [
      {
        role: 'assistant',
        content: '압구정동 최근 실거래가를 분석해 드리겠습니다.',
        richType: 'chart',
      },
    ],
  },
  {
    keywords: ['수수료', '중개수수료', '중개비', '계산'],
    messages: [
      {
        role: 'assistant',
        content: '중개수수료를 계산해 드리겠습니다. 아래에서 거래 유형과 금액을 입력해 주세요.',
        richType: 'calculator',
      },
    ],
  },
  {
    keywords: ['전세사기', '전세 사기', '사기 예방', '예방'],
    messages: [
      {
        role: 'assistant',
        content: '전세사기 예방을 위한 핵심 체크리스트를 안내해 드리겠습니다.',
        richType: 'checklist',
      },
    ],
  },
  {
    keywords: ['거래신고', '거래 신고', '신고 방법', '부동산거래신고', '계약 신고서', '변경신고', '해제신고'],
    messages: [
      {
        role: 'assistant',
        content: '부동산 거래신고 절차를 안내해 드리겠습니다.',
        richType: 'steps',
      },
    ],
  },
  {
    keywords: ['토지거래허가', '허가구역', '실거주 의무', '입주권', '분양권'],
    messages: [
      {
        role: 'assistant',
        content: '토지거래허가구역 안내가 필요하시면 민원 가이드에서 실거주 의무·허가 기준·관리처분계획 기준을 한 번에 확인할 수 있어요.',
        richType: 'default',
      },
    ],
  },
  {
    keywords: ['공인중개사사무소', '개설등록', '이전신고', '중개업 개설'],
    messages: [
      {
        role: 'assistant',
        content: '공인중개사사무소 개설·이전 안내를 도와드릴게요. 개설등록 신청, 이전신고, 유의사항 순서로 확인하면 됩니다.',
        richType: 'default',
      },
    ],
  },
  {
    keywords: ['민원서식', '서식 모음', '신고서 양식', '위임장'],
    messages: [
      {
        role: 'assistant',
        content: '민원서식 모음과 신고서 양식 링크를 바로 열어볼 수 있게 준비해뒀어요.',
        richType: 'default',
      },
    ],
  },
];

export const defaultResponse: ChatMessage = {
  role: 'assistant',
  content: '카카오 채널 기준으로 자주 찾는 항목을 빠르게 안내해드릴게요. 아래 질문을 눌러 시작해 보세요:',
  richType: 'default',
};

export const suggestionCards = [
  { title: '민원서식 모음', subtitle: '자주 쓰는 부동산 민원서식', icon: '🗂️' },
  { title: '부동산 계약 신고서 안내', subtitle: '변경·해제 신고 핵심 정리', icon: '📝' },
  { title: '토지거래허가구역 안내', subtitle: '실거주 의무/허가 기준', icon: '🏗️' },
  { title: '공인중개사사무소 개설·이전', subtitle: '개설등록/이전신고 안내', icon: '🏢' },
];

export const fraudChecklist = [
  { id: 1, text: '등기부등본 직접 열람 (인터넷등기소)', checked: false },
  { id: 2, text: '임대인 본인 확인 (신분증 대조)', checked: false },
  { id: 3, text: '선순위 권리 확인 (근저당, 가압류 등)', checked: false },
  { id: 4, text: '전세가율 확인 (시세 대비 80% 이하 권장)', checked: false },
  { id: 5, text: '공인중개사 자격 확인 (국가공간정보포털)', checked: false },
  { id: 6, text: '전세보증보험 가입 가능 여부 확인', checked: false },
  { id: 7, text: '임대차 신고 및 확정일자 받기', checked: false },
  { id: 8, text: '전입신고 즉시 완료', checked: false },
];

export const transactionSteps = [
  { step: 1, title: '거래 계약 체결', desc: '매수인·매도인 간 매매계약서 작성 (공인중개사 입회)' },
  { step: 2, title: '거래신고서 작성', desc: '부동산거래관리시스템(RTMS)에서 온라인 작성 또는 구청 방문' },
  { step: 3, title: '신고서 제출', desc: '계약 체결일로부터 30일 이내 관할 시·군·구청에 제출' },
  { step: 4, title: '신고필증 수령', desc: '신고 접수 후 신고필증 발급 (등기 시 필요)' },
  { step: 5, title: '소유권 이전등기', desc: '잔금일로부터 60일 이내 관할 등기소에서 등기 이전' },
];

export const recentChats = [
  { id: '1', title: '민원서식 모음', date: '오늘' },
  { id: '2', title: '부동산 계약 신고서 안내', date: '오늘' },
  { id: '3', title: '토지거래허가구역 안내', date: '어제' },
  { id: '4', title: '공인중개사사무소 개설·이전', date: '3일 전' },
];
