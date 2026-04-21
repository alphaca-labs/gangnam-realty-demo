export type CaseType = 'self-occupy' | 'non-residential' | 'tax-deferral' | 'proxy';

export interface CaseDefinition {
  type: CaseType;
  label: string;
  description: string;
  iconEmoji: string;
  documents: string[];
}

export const caseDefinitions: CaseDefinition[] = [
  {
    type: 'self-occupy',
    label: '자기 거주 목적',
    description: '본인이 직접 거주할 목적으로 토지를 취득하는 경우',
    iconEmoji: '🏠',
    documents: ['허가신청서', '토지이용계획서(자기거주)', '자금조달계획서', '개인정보동의서'],
  },
  {
    type: 'non-residential',
    label: '비거주 / 기타 목적',
    description: '사업용, 투자 등 비거주 목적으로 토지를 취득하는 경우',
    iconEmoji: '🏢',
    documents: ['허가신청서', '토지이용계획서(기타)', '자금조달계획서', '개인정보동의서'],
  },
  {
    type: 'tax-deferral',
    label: '양도세 실거주 유예',
    description: '다주택자 양도세 중과 유예를 위해 실거주 요건을 충족하는 경우',
    iconEmoji: '⚖️',
    documents: ['허가신청서', '토지이용계획서(양도세유예)', '자금조달계획서', '개인정보동의서'],
  },
  {
    type: 'proxy',
    label: '대리 신청',
    description: '본인 대신 대리인이 토지거래허가를 신청하는 경우 (위임장 추가)',
    iconEmoji: '👥',
    documents: ['허가신청서', '토지이용계획서(자기거주)', '자금조달계획서', '개인정보동의서', '위임장'],
  },
];

/* ─── Form data interfaces ─── */

export interface ApplicationFormData {
  sellerName: string;
  sellerIdNumber: string;
  sellerAddress: string;
  sellerPhone: string;
  buyerName: string;
  buyerIdNumber: string;
  buyerAddress: string;
  buyerPhone: string;
  rightType: '소유권' | '지상권';
  landAddress: string;
  landLotNumber: string;
  landCategory: string;
  landArea: string;
  landZone: string;
  contractAmount: string;
}

export interface LandUsePlanSelfFormData {
  applicantName: string;
  applicantBirth: string;
  applicantPhone: string;
  applicantAddress: string;
  landAddress: string;
  landLotNumber: string;
  landCategory: string;
  landArea: string;
  landZone: string;
  purchasePurpose: string;
  usePlan: string;
  hasExistingHouse: boolean;
  existingHouseDisposal: string;
  moveInDate: string;
}

export interface LandUsePlanOtherFormData {
  applicantName: string;
  applicantBirth: string;
  applicantPhone: string;
  applicantAddress: string;
  landAddress: string;
  landLotNumber: string;
  landCategory: string;
  landArea: string;
  landZone: string;
  purchasePurpose: string;
  usePlan: string;
}

export interface LandUsePlanTaxFormData {
  // 매도인 섹션
  sellerIsMultiHouseOwner: boolean;
  sellerHouseList: string;
  sellerAcquisitionDate: string;
  sellerContractDate: string;
  // 매수인 섹션
  buyerIsNoHouse: boolean;
  buyerPurchasePurpose: string;
  buyerMoveInPlan: string;
  buyerDepositReturnPlan: string;
  // 공통
  applicantName: string;
  applicantBirth: string;
  applicantPhone: string;
  applicantAddress: string;
  landAddress: string;
  landLotNumber: string;
  landCategory: string;
  landArea: string;
  landZone: string;
}

export interface FundingPlanFormData {
  depositAmount: string;
  stockAmount: string;
  giftAmount: string;
  cashAmount: string;
  propertyDisposalAmount: string;
  compensationAmount: string;
  mortgageLoan: string;
  creditLoan: string;
  otherLoan: string;
  otherBorrowing: string;
}

export interface PrivacyConsentFormData {
  consent1: boolean;
  consent2: boolean;
  consent3: boolean;
  consent4: boolean;
  name: string;
  birth: string;
  phone: string;
}

export interface ProxyFormData {
  principalName: string;
  principalIdNumber: string;
  principalAddress: string;
  principalPhone: string;
  agentName: string;
  agentIdNumber: string;
  agentAddress: string;
  agentPhone: string;
  propertyAddress: string;
}

/* ─── Initial data (demo pre-fill) ─── */

export const initialApplicationData: ApplicationFormData = {
  sellerName: '김영수',
  sellerIdNumber: '650412-1******',
  sellerAddress: '서울시 강남구 역삼동 456-78',
  sellerPhone: '010-1234-5678',
  buyerName: '이지은',
  buyerIdNumber: '850923-2******',
  buyerAddress: '서울시 서초구 반포동 321-12',
  buyerPhone: '010-9876-5432',
  rightType: '소유권',
  landAddress: '서울시 강남구 압구정동',
  landLotNumber: '123-45',
  landCategory: '대',
  landArea: '198.5',
  landZone: '제3종일반주거지역',
  contractAmount: '1,500,000,000',
};

export const initialLandUseSelfData: LandUsePlanSelfFormData = {
  applicantName: '이지은',
  applicantBirth: '1985-09-23',
  applicantPhone: '010-9876-5432',
  applicantAddress: '서울시 서초구 반포동 321-12',
  landAddress: '서울시 강남구 압구정동',
  landLotNumber: '123-45',
  landCategory: '대',
  landArea: '198.5',
  landZone: '제3종일반주거지역',
  purchasePurpose: '본인 실거주 목적 (자녀 학교 인근)',
  usePlan: '기존 단독주택 리모델링 후 거주 예정',
  hasExistingHouse: true,
  existingHouseDisposal: '기존 서초구 반포동 아파트 매도 예정 (2026년 6월 이전)',
  moveInDate: '2026-08-01',
};

export const initialLandUseOtherData: LandUsePlanOtherFormData = {
  applicantName: '이지은',
  applicantBirth: '1985-09-23',
  applicantPhone: '010-9876-5432',
  applicantAddress: '서울시 서초구 반포동 321-12',
  landAddress: '서울시 강남구 압구정동',
  landLotNumber: '123-45',
  landCategory: '대',
  landArea: '198.5',
  landZone: '제3종일반주거지역',
  purchasePurpose: '근린생활시설 신축을 위한 부지 확보. 1층 상가, 2~3층 사무실로 활용 예정.',
  usePlan: '2026년 하반기 건축 허가 신청 예정. 완공 후 임대 운영 계획. 총 공사 기간 약 18개월 예상.',
};

export const initialLandUseTaxData: LandUsePlanTaxFormData = {
  sellerIsMultiHouseOwner: true,
  sellerHouseList: '서울시 강남구 역삼동 아파트 (2018년 취득)\n경기도 성남시 분당구 아파트 (2020년 취득)',
  sellerAcquisitionDate: '2018-03-15',
  sellerContractDate: '2026-05-10',
  buyerIsNoHouse: true,
  buyerPurchasePurpose: '실거주 목적 (자녀 학교 인근 이주)',
  buyerMoveInPlan: '잔금일로부터 3개월 이내 전입신고 및 실거주 예정',
  buyerDepositReturnPlan: '현재 전세 보증금 5억원 → 계약 만기(2026.07) 시 반환 후 자금 충당',
  applicantName: '이지은',
  applicantBirth: '1985-09-23',
  applicantPhone: '010-9876-5432',
  applicantAddress: '서울시 서초구 반포동 321-12',
  landAddress: '서울시 강남구 압구정동',
  landLotNumber: '123-45',
  landCategory: '대',
  landArea: '198.5',
  landZone: '제3종일반주거지역',
};

export const initialFundingData: FundingPlanFormData = {
  depositAmount: '500,000,000',
  stockAmount: '200,000,000',
  giftAmount: '0',
  cashAmount: '50,000,000',
  propertyDisposalAmount: '300,000,000',
  compensationAmount: '0',
  mortgageLoan: '400,000,000',
  creditLoan: '50,000,000',
  otherLoan: '0',
  otherBorrowing: '0',
};

export const initialPrivacyData: PrivacyConsentFormData = {
  consent1: true,
  consent2: true,
  consent3: true,
  consent4: true,
  name: '이지은',
  birth: '1985-09-23',
  phone: '010-9876-5432',
};

export const initialProxyData: ProxyFormData = {
  principalName: '이지은',
  principalIdNumber: '850923-2******',
  principalAddress: '서울시 서초구 반포동 321-12',
  principalPhone: '010-9876-5432',
  agentName: '박서준',
  agentIdNumber: '900315-1******',
  agentAddress: '서울시 강남구 논현동 789-12',
  agentPhone: '010-5555-7777',
  propertyAddress: '서울시 강남구 압구정동 123-45',
};

export const consentItems = [
  '개인정보의 수집 및 이용에 동의합니다.',
  '개인정보의 제3자 제공에 동의합니다.',
  '개인정보의 보유 및 이용기간에 동의합니다.',
  '고유식별정보(주민등록번호) 처리에 동의합니다.',
];
