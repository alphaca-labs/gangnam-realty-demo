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
    title: '토지거래허가',
    icon: '🏗️',
    description: '토지거래허가구역 내 일정 면적 이상 거래 시',
    steps: [
      { title: '허가구역 확인', description: '토지이용규제정보서비스에서 허가구역 여부 확인', tip: '강남구 일부 지역이 허가구역입니다' },
      { title: '허가신청서 작성', description: '토지거래허가 신청서 및 토지이용계획서 작성' },
      { title: '관할 구청 제출', description: '매수인과 매도인 공동으로 관할 시·군·구청에 신청' },
      { title: '심사 (15일)', description: '접수일로부터 15일 이내 허가 여부 결정', tip: '부적합 시 불허가 통보' },
      { title: '허가증 수령', description: '허가 결정 시 토지거래허가증 발급' },
      { title: '매매계약 체결', description: '허가증 수령 후 본계약 체결 진행' },
    ],
  },
  {
    id: 'brokerage-open',
    title: '중개업 개설',
    icon: '🏢',
    description: '공인중개사 자격 취득 후 중개사무소 개설',
    steps: [
      { title: '공인중개사 자격 취득', description: '공인중개사 시험 합격 후 자격증 발급', tip: '매년 10월경 시험 실시' },
      { title: '실무교육 이수', description: '한국공인중개사협회 실무교육 28시간 이수' },
      { title: '사무소 확보', description: '중개사무소로 사용할 건축물 임차 또는 소유' },
      { title: '중개업 등록신청', description: '관할 시·군·구청에 중개사무소 등록신청', tip: '보증보험 가입 필수' },
      { title: '등록증 수령', description: '등록 심사 후 중개사무소 등록증 발급' },
      { title: '협회 가입', description: '한국공인중개사협회 가입 (선택사항이나 권장)' },
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
