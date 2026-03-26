export interface GuideCategory {
  slug: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  steps: { step: number; title: string; desc: string }[];
  notice?: string;
  checklist?: string[];
}

export const guideCategories: GuideCategory[] = [
  {
    slug: "transaction-report",
    title: "거래신고",
    icon: "FileText",
    description: "부동산 거래 후 30일 이내 신고 절차를 안내합니다.",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    steps: [
      { step: 1, title: "거래 계약 체결", desc: "매매·교환 등 부동산 거래 계약을 체결합니다." },
      { step: 2, title: "거래신고서 작성", desc: "거래 당사자 또는 중개업자가 거래신고서를 작성합니다." },
      { step: 3, title: "온라인/방문 신고", desc: "부동산거래관리시스템(rtms.molit.go.kr) 또는 시·군·구청 방문 신고합니다." },
      { step: 4, title: "신고필증 수령", desc: "신고가 수리되면 신고필증을 발급받습니다." },
      { step: 5, title: "소유권 이전등기", desc: "잔금 지급 후 60일 이내 소유권 이전등기를 신청합니다." },
    ],
    notice: "거래신고 기한: 계약일로부터 30일 이내 (위반 시 과태료 부과)",
  },
  {
    slug: "land-permit",
    title: "토지거래허가",
    icon: "MapPin",
    description: "허가구역 내 토지 거래 시 필요한 허가 절차를 안내합니다.",
    color: "bg-green-50 text-green-700 border-green-200",
    steps: [
      { step: 1, title: "허가구역 확인", desc: "해당 토지가 토지거래허가구역인지 확인합니다." },
      { step: 2, title: "토지이용계획 수립", desc: "토지 취득 후 이용 계획을 구체적으로 수립합니다." },
      { step: 3, title: "허가 신청", desc: "매수인 또는 공동으로 시·군·구청에 허가를 신청합니다." },
      { step: 4, title: "허가증 발급", desc: "심사 후 허가증이 발급됩니다 (처리기간: 15일)." },
      { step: 5, title: "계약 체결", desc: "허가를 받은 후 매매계약을 체결합니다." },
    ],
    notice: "강남구 일부 지역은 토지거래허가구역으로 지정되어 있습니다.",
  },
  {
    slug: "brokerage-office",
    title: "중개업 개설",
    icon: "Building2",
    description: "공인중개사 사무소 개설/폐업 절차를 안내합니다.",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    steps: [
      { step: 1, title: "자격 확인", desc: "공인중개사 자격증을 보유하고 있는지 확인합니다." },
      { step: 2, title: "사무소 확보", desc: "중개사무소로 사용할 사무실을 확보합니다." },
      { step: 3, title: "보증 설정", desc: "공제증서 가입 또는 보증보험에 가입합니다." },
      { step: 4, title: "개설 등록 신청", desc: "관할 시·군·구청에 개설 등록을 신청합니다." },
      { step: 5, title: "등록증 수령", desc: "심사 후 중개사무소 등록증을 수령합니다." },
    ],
    notice: "중개사무소 등록 처리기간: 약 10일",
  },
  {
    slug: "fraud-prevention",
    title: "전세사기 예방",
    icon: "ShieldCheck",
    description: "전세사기 피해를 예방하기 위한 체크리스트입니다.",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    steps: [
      { step: 1, title: "등기부등본 확인", desc: "계약 직전 등기부등본을 발급받아 소유자, 근저당, 가압류 등을 확인하세요." },
      { step: 2, title: "임대인 본인 확인", desc: "신분증과 등기부등본 소유자가 일치하는지 대면 확인하세요." },
      { step: 3, title: "시세 확인", desc: "주변 전세 시세를 확인하고, 지나치게 저렴한 매물은 주의하세요." },
      { step: 4, title: "보증보험 가입", desc: "전세보증금 반환보증보험(HUG, SGI)에 반드시 가입하세요." },
      { step: 5, title: "전입신고 + 확정일자", desc: "입주 당일 전입신고와 확정일자를 반드시 받으세요." },
      { step: 6, title: "공인중개사 확인", desc: "중개사무소 등록 여부를 확인하고, 공제증서를 확인하세요." },
    ],
    checklist: [
      "등기부등본 최근 발급본 확인",
      "임대인 신분증 대조",
      "주변 시세 대비 적정 가격 확인",
      "선순위 근저당 합계 확인 (전세가 대비)",
      "보증보험 가입 가능 여부 확인",
      "중개사무소 정상 등록 여부 확인",
      "계약서 특약사항 확인",
      "잔금일 등기부등본 재확인",
    ],
  },
];
