export interface ChatScenario {
  keywords: string[];
  response: string;
  cardType: "chart" | "table" | "guide" | "calculator" | "text";
  suggestions: string[];
}

export const chatScenarios: ChatScenario[] = [
  {
    keywords: ["압구정", "실거래", "실거래가", "압구정동"],
    response: "압구정동 최근 실거래가를 알려드릴게요. 아래 차트와 테이블에서 최근 거래 내역을 확인하세요.",
    cardType: "chart",
    suggestions: ["대치동 실거래가도 보여줘", "중개수수료 얼마야?", "전세사기 예방 방법"],
  },
  {
    keywords: ["수수료", "중개수수료", "중개", "얼마"],
    response: "중개수수료를 계산해 드릴게요! 아래 계산기에서 거래 유형과 금액을 입력하면 예상 수수료를 바로 확인할 수 있어요.",
    cardType: "calculator",
    suggestions: ["매매 5억 수수료", "전세 3억 수수료", "실거래가 조회"],
  },
  {
    keywords: ["전세사기", "전세 사기", "사기 예방", "예방"],
    response: "전세사기 예방을 위한 체크리스트를 안내해 드릴게요. 꼭 확인하세요!",
    cardType: "guide",
    suggestions: ["거래신고 방법", "실거래가 조회", "중개수수료 계산"],
  },
  {
    keywords: ["거래신고", "거래 신고", "신고 방법", "신고"],
    response: "부동산 거래신고 절차를 안내해 드릴게요. 거래 후 30일 이내에 신고하셔야 합니다.",
    cardType: "guide",
    suggestions: ["토지거래허가 안내", "중개수수료 계산", "전세사기 예방"],
  },
  {
    keywords: [],
    response: "아직 준비 중인 기능이에요. 아래 추천 질문을 이용해 보세요!",
    cardType: "text",
    suggestions: ["압구정동 실거래가", "중개수수료 얼마?", "전세사기 예방 방법", "거래신고 방법"],
  },
];

export const fraudPreventionGuide = {
  title: "전세사기 예방 체크리스트",
  steps: [
    { step: 1, title: "등기부등본 확인", desc: "계약 직전 등기부등본을 발급받아 소유자, 근저당, 가압류 등을 확인하세요." },
    { step: 2, title: "임대인 본인 확인", desc: "신분증과 등기부등본 소유자가 일치하는지 확인하세요." },
    { step: 3, title: "시세 확인", desc: "주변 전세 시세를 확인하고, 지나치게 저렴한 매물은 주의하세요." },
    { step: 4, title: "보증보험 가입", desc: "전세보증금 반환보증보험(HUG, SGI)에 가입하세요." },
    { step: 5, title: "전입신고 + 확정일자", desc: "입주 당일 전입신고와 확정일자를 반드시 받으세요." },
    { step: 6, title: "공인중개사 확인", desc: "중개사무소 등록 여부를 확인하고, 공제증서를 확인하세요." },
  ],
};

export const transactionReportGuide = {
  title: "부동산 거래신고 절차",
  steps: [
    { step: 1, title: "거래 계약 체결", desc: "매매·교환 등 부동산 거래 계약을 체결합니다." },
    { step: 2, title: "거래신고서 작성", desc: "거래 당사자 또는 중개업자가 거래신고서를 작성합니다." },
    { step: 3, title: "온라인/방문 신고", desc: "부동산거래관리시스템(rtms.molit.go.kr) 또는 시·군·구청 방문 신고" },
    { step: 4, title: "신고필증 수령", desc: "신고가 수리되면 신고필증을 발급받습니다." },
    { step: 5, title: "소유권 이전등기", desc: "잔금 지급 후 60일 이내 소유권 이전등기를 신청합니다." },
  ],
  notice: "거래신고 기한: 계약일로부터 30일 이내 (위반 시 과태료 부과)",
};
