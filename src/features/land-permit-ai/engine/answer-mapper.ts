import {
  type CaseType,
  type ApplicationFormData,
  type LandUsePlanSelfFormData,
  type LandUsePlanOtherFormData,
  type LandUsePlanTaxFormData,
  type FundingPlanFormData,
  type PrivacyConsentFormData,
  type ProxyFormData,
  initialApplicationData,
  initialLandUseSelfData,
  initialLandUseOtherData,
  initialLandUseTaxData,
  initialFundingData,
  initialPrivacyData,
  initialProxyData,
} from '@/data/land-permit';
import type { Answers } from '../types/answers';
import { formatAmountInput } from '../utils/currency';

function asString(v: unknown, fallback = ''): string {
  if (v == null) return fallback;
  return String(v);
}

function asBool(v: unknown, fallback = false): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true' || v === '1';
  return fallback;
}

function asAmount(v: unknown, fallback = '0'): string {
  const s = asString(v, fallback);
  if (!s) return fallback;
  return formatAmountInput(s);
}

interface AnswersBuckets {
  application?: Partial<ApplicationFormData>;
  landUseSelf?: Partial<LandUsePlanSelfFormData>;
  landUseOther?: Partial<LandUsePlanOtherFormData>;
  landUseTax?: Partial<LandUsePlanTaxFormData>;
  funding?: Partial<FundingPlanFormData>;
  privacy?: Partial<PrivacyConsentFormData>;
  proxy?: Partial<ProxyFormData>;
}

export function mapApplication(answers: Answers): ApplicationFormData {
  const a = (answers as AnswersBuckets).application ?? {};
  return {
    sellerName: asString(a.sellerName, initialApplicationData.sellerName),
    sellerIdNumber: asString(a.sellerIdNumber, initialApplicationData.sellerIdNumber),
    sellerAddress: asString(a.sellerAddress, initialApplicationData.sellerAddress),
    sellerPhone: asString(a.sellerPhone, initialApplicationData.sellerPhone),
    buyerName: asString(a.buyerName, initialApplicationData.buyerName),
    buyerIdNumber: asString(a.buyerIdNumber, initialApplicationData.buyerIdNumber),
    buyerAddress: asString(a.buyerAddress, initialApplicationData.buyerAddress),
    buyerPhone: asString(a.buyerPhone, initialApplicationData.buyerPhone),
    rightType: (a.rightType === '지상권' ? '지상권' : '소유권') as ApplicationFormData['rightType'],
    landAddress: asString(a.landAddress, initialApplicationData.landAddress),
    landLotNumber: asString(a.landLotNumber, initialApplicationData.landLotNumber),
    landCategory: asString(a.landCategory, initialApplicationData.landCategory),
    landArea: asString(a.landArea, initialApplicationData.landArea),
    landZone: asString(a.landZone, initialApplicationData.landZone),
    contractAmount: asAmount(a.contractAmount, initialApplicationData.contractAmount),
  };
}

export function mapLandUseSelf(answers: Answers): LandUsePlanSelfFormData {
  const app = mapApplication(answers);
  const s = (answers as AnswersBuckets).landUseSelf ?? {};
  return {
    applicantName: app.buyerName || initialLandUseSelfData.applicantName,
    applicantBirth: extractBirthFromIdNumber(app.buyerIdNumber) || initialLandUseSelfData.applicantBirth,
    applicantPhone: app.buyerPhone || initialLandUseSelfData.applicantPhone,
    applicantAddress: app.buyerAddress || initialLandUseSelfData.applicantAddress,
    landAddress: app.landAddress,
    landLotNumber: app.landLotNumber,
    landCategory: app.landCategory,
    landArea: app.landArea,
    landZone: app.landZone,
    purchasePurpose: asString(s.purchasePurpose, initialLandUseSelfData.purchasePurpose),
    usePlan: asString(s.usePlan, initialLandUseSelfData.usePlan),
    hasExistingHouse: asBool(s.hasExistingHouse, initialLandUseSelfData.hasExistingHouse),
    existingHouseDisposal: asString(
      s.existingHouseDisposal,
      initialLandUseSelfData.existingHouseDisposal,
    ),
    moveInDate: asString(s.moveInDate, initialLandUseSelfData.moveInDate),
  };
}

export function mapLandUseOther(answers: Answers): LandUsePlanOtherFormData {
  const app = mapApplication(answers);
  const o = (answers as AnswersBuckets).landUseOther ?? {};
  return {
    applicantName: app.buyerName || initialLandUseOtherData.applicantName,
    applicantBirth: extractBirthFromIdNumber(app.buyerIdNumber) || initialLandUseOtherData.applicantBirth,
    applicantPhone: app.buyerPhone || initialLandUseOtherData.applicantPhone,
    applicantAddress: app.buyerAddress || initialLandUseOtherData.applicantAddress,
    landAddress: app.landAddress,
    landLotNumber: app.landLotNumber,
    landCategory: app.landCategory,
    landArea: app.landArea,
    landZone: app.landZone,
    purchasePurpose: asString(o.purchasePurpose, initialLandUseOtherData.purchasePurpose),
    usePlan: asString(o.usePlan, initialLandUseOtherData.usePlan),
  };
}

export function mapLandUseTax(answers: Answers): LandUsePlanTaxFormData {
  const app = mapApplication(answers);
  const t = (answers as AnswersBuckets).landUseTax ?? {};
  return {
    sellerIsMultiHouseOwner: asBool(t.sellerIsMultiHouseOwner, initialLandUseTaxData.sellerIsMultiHouseOwner),
    sellerHouseList: asString(t.sellerHouseList, initialLandUseTaxData.sellerHouseList),
    sellerAcquisitionDate: asString(t.sellerAcquisitionDate, initialLandUseTaxData.sellerAcquisitionDate),
    sellerContractDate: asString(t.sellerContractDate, initialLandUseTaxData.sellerContractDate),
    buyerIsNoHouse: asBool(t.buyerIsNoHouse, initialLandUseTaxData.buyerIsNoHouse),
    buyerPurchasePurpose: asString(t.buyerPurchasePurpose, initialLandUseTaxData.buyerPurchasePurpose),
    buyerMoveInPlan: asString(t.buyerMoveInPlan, initialLandUseTaxData.buyerMoveInPlan),
    buyerDepositReturnPlan: asString(t.buyerDepositReturnPlan, initialLandUseTaxData.buyerDepositReturnPlan),
    applicantName: app.buyerName || initialLandUseTaxData.applicantName,
    applicantBirth: extractBirthFromIdNumber(app.buyerIdNumber) || initialLandUseTaxData.applicantBirth,
    applicantPhone: app.buyerPhone || initialLandUseTaxData.applicantPhone,
    applicantAddress: app.buyerAddress || initialLandUseTaxData.applicantAddress,
    landAddress: app.landAddress,
    landLotNumber: app.landLotNumber,
    landCategory: app.landCategory,
    landArea: app.landArea,
    landZone: app.landZone,
  };
}

export function mapFunding(answers: Answers): FundingPlanFormData {
  const f = (answers as AnswersBuckets).funding ?? {};
  return {
    depositAmount: asAmount(f.depositAmount, initialFundingData.depositAmount),
    stockAmount: asAmount(f.stockAmount, initialFundingData.stockAmount),
    giftAmount: asAmount(f.giftAmount, initialFundingData.giftAmount),
    cashAmount: asAmount(f.cashAmount, initialFundingData.cashAmount),
    propertyDisposalAmount: asAmount(f.propertyDisposalAmount, initialFundingData.propertyDisposalAmount),
    compensationAmount: asAmount(f.compensationAmount, initialFundingData.compensationAmount),
    mortgageLoan: asAmount(f.mortgageLoan, initialFundingData.mortgageLoan),
    creditLoan: asAmount(f.creditLoan, initialFundingData.creditLoan),
    otherLoan: asAmount(f.otherLoan, initialFundingData.otherLoan),
    otherBorrowing: asAmount(f.otherBorrowing, initialFundingData.otherBorrowing),
  };
}

export function mapPrivacy(answers: Answers): PrivacyConsentFormData {
  const app = mapApplication(answers);
  const p = (answers as AnswersBuckets).privacy ?? {};
  return {
    consent1: asBool(p.consent1, initialPrivacyData.consent1),
    consent2: asBool(p.consent2, initialPrivacyData.consent2),
    consent3: asBool(p.consent3, initialPrivacyData.consent3),
    consent4: asBool(p.consent4, initialPrivacyData.consent4),
    name: app.buyerName || initialPrivacyData.name,
    birth: extractBirthFromIdNumber(app.buyerIdNumber) || initialPrivacyData.birth,
    phone: app.buyerPhone || initialPrivacyData.phone,
  };
}

export function mapProxy(answers: Answers): ProxyFormData {
  const p = (answers as AnswersBuckets).proxy ?? {};
  return {
    principalName: asString(p.principalName, initialProxyData.principalName),
    principalIdNumber: asString(p.principalIdNumber, initialProxyData.principalIdNumber),
    principalAddress: asString(p.principalAddress, initialProxyData.principalAddress),
    principalPhone: asString(p.principalPhone, initialProxyData.principalPhone),
    agentName: asString(p.agentName, initialProxyData.agentName),
    agentIdNumber: asString(p.agentIdNumber, initialProxyData.agentIdNumber),
    agentAddress: asString(p.agentAddress, initialProxyData.agentAddress),
    agentPhone: asString(p.agentPhone, initialProxyData.agentPhone),
    propertyAddress: asString(p.propertyAddress, initialProxyData.propertyAddress),
  };
}

function extractBirthFromIdNumber(rrn: string): string {
  if (!rrn) return '';
  const digits = rrn.replace(/[^0-9]/g, '');
  if (digits.length < 7) return '';
  const yy = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const dd = digits.slice(4, 6);
  const g = digits[6];
  let century = '19';
  if (g === '3' || g === '4' || g === '7' || g === '8') century = '20';
  return `${century}${yy}-${mm}-${dd}`;
}

export interface MappedFormBundle {
  caseType: CaseType;
  application: ApplicationFormData;
  landUseSelf: LandUsePlanSelfFormData;
  landUseOther: LandUsePlanOtherFormData;
  landUseTax: LandUsePlanTaxFormData;
  funding: FundingPlanFormData;
  privacy: PrivacyConsentFormData;
  proxy: ProxyFormData;
}

export function mapAnswersToForms(caseType: CaseType, answers: Answers): MappedFormBundle {
  return {
    caseType,
    application: mapApplication(answers),
    landUseSelf: mapLandUseSelf(answers),
    landUseOther: mapLandUseOther(answers),
    landUseTax: mapLandUseTax(answers),
    funding: mapFunding(answers),
    privacy: mapPrivacy(answers),
    proxy: mapProxy(answers),
  };
}
