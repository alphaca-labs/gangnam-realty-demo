export interface GuideStep {
  title: string;
  description: string;
  tip?: string;
}

export interface CivilGuide {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: GuideStep[];
}

export const civilGuides: CivilGuide[] = [
  {
    id: 'transaction-report',
    title: '부동산 거래신고',
    icon: '📝',
    description: '매매계약 체결 후 30일 이내 신고',
    steps: [
      { title: '매매계약 체결', description: '공인중개사 입회하에 매매계약서 작성', tip: '특약사항을 꼼꼼히 확인하세요' },
      { title: '거래신고서 작성', description: '부동산거래관리시스템(RTMS)에서 온라인 신고 또는 구청 방문', tip: '온라인 신고가 더 빠릅니다' },
      { title: '필요서류 준비', description: '매매계약서 사본, 신분증, 거래신고서' },
      { title: '관할 구청 제출', description: '부동산 소재지 관할 시·군·구청에 제출', tip: '계약일로부터 30일 이내' },
      { title: '신고필증 수령', description: '접수 후 신고필증 발급 (소유권이전등기 시 필요)' },
    ],
  },
  {
    id: 'land-permission',
    title: '토지거래허가구역 안내',
    icon: '🏗️',
    description: '실거주 의무 및 허가 기준 안내',
    steps: [
      { title: '실거주 의무', description: '허가 받은 목적대로 이용해야 하며, 주거용은 2년간 실거주 의무가 발생합니다.' },
      { title: '기존 주택 보유자', description: '기존 주택 보유자가 신규 취득 시 처분 조건부 허가가 가능할 수 있습니다.' },
      { title: '입주권·분양권 관련', description: '정비사업 구역 내 입주권 및 분양권 거래 시 허가 대상 여부를 확인하세요.' },
      { title: '허가 기준', description: '이용 목적의 적절성, 면적의 적정성 등을 종합적으로 심사합니다.', tip: '강남구청 부동산정보과에 사전 문의 권장' },
      { title: '관리처분계획 인가 이후', description: '재건축/재개발 관리처분계획 인가 이후 거래 시 허가 예외 사항을 확인하세요.' },
      { title: '단속 및 조사', description: '허가 후 이용 실태 조사가 정기적으로 실시되며 위반 시 이행강제금이 부과될 수 있습니다.' },
    ],
  },
  {
    id: 'brokerage-open',
    title: '공인중개사사무소 개설·이전',
    icon: '🏢',
    description: '개설등록 및 사무소 이전 신고 안내',
    steps: [
      { title: '개설등록 신청', description: '자격증, 실무교육 이수증, 사무소 확보 서류 등을 갖추어 등록을 신청합니다.' },
      { title: '이전신고', description: '사무소를 이전한 날부터 10일 이내에 이전 후의 관할 등록관청에 신고해야 합니다.' },
      { title: '유의사항', description: '결격사유 조회, 인장 등록, 고용인 신고 등 제반 의무 사항을 준수하세요.', tip: '보증보험(공제) 가입이 완료되어야 등록증 교부' },
      { title: '문의 및 서류 제출', description: '강남구청 부동산정보과 방문 또는 정부24 온라인 민원을 통해 제출 가능합니다.', tip: '☎ 02-3423-xxxx' },
    ],
  },
  {
    id: 'fraud-prevention',
    title: '전세사기 예방',
    icon: '🛡️',
    description: '안전한 전세 거래를 위한 체크리스트',
    steps: [
      { title: '등기부등본 열람', description: '인터넷등기소에서 직접 열람하여 소유자 및 권리관계 확인', tip: '계약 당일 반드시 재확인' },
      { title: '임대인 본인 확인', description: '등기부상 소유자와 계약 상대방 일치 여부 확인 (신분증 대조)' },
      { title: '선순위 권리 확인', description: '근저당권, 가압류, 전세권 등 선순위 권리 총액 확인', tip: '선순위 채권 + 보증금 < 시세 80%' },
      { title: '전세가율 확인', description: '주변 시세 대비 전세가율 80% 이하인지 확인' },
      { title: '보증보험 가입', description: '전세보증금반환보증보험(HUG/SGI) 가입 가능 여부 확인', tip: '가입 불가 물건은 위험 신호' },
      { title: '확정일자 취득', description: '전입신고 후 주민센터에서 확정일자 받기' },
      { title: '전입신고', description: '잔금일 당일 전입신고 완료', tip: '대항력 확보의 핵심' },
      { title: '임대차 신고', description: '보증금 6천만원 초과 시 30일 이내 임대차 신고' },
    ],
  },
];
