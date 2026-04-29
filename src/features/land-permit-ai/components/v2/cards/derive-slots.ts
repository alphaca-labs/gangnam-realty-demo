import type { CaseType } from '@/data/land-permit';
import type { Answers } from '../../../types/answers';
import { caseDefinitions } from '@/data/land-permit';
import type {
  AssistantTurnContext,
  FieldDescriptor,
  RichSlot,
  StepDef,
} from './types';
import { buildSummaryRows } from './summary-rows';

export const FIELD_LABEL: Record<string, string> = {
  'application.sellerName': '매도인 이름',
  'application.sellerIdNumber': '매도인 주민번호',
  'application.sellerAddress': '매도인 주소',
  'application.sellerPhone': '매도인 연락처',
  'application.buyerName': '매수인 이름',
  'application.buyerIdNumber': '매수인 주민번호',
  'application.buyerAddress': '매수인 주소',
  'application.buyerPhone': '매수인 연락처',
  'application.rightType': '권리 종류',
  'application.landAddress': '토지 소재지',
  'application.landLotNumber': '지번',
  'application.landCategory': '지목',
  'application.landArea': '면적(㎡)',
  'application.landZone': '용도지역',
  'application.contractAmount': '계약예정금액',
  'landUseSelf.purchasePurpose': '매수 목적 (자기거주)',
  'landUseSelf.usePlan': '이용 계획',
  'landUseSelf.hasExistingHouse': '기존 주택 보유 여부',
  'landUseSelf.existingHouseDisposal': '기존 주택 처분 계획',
  'landUseSelf.moveInDate': '입주 예정일',
  'landUseOther.purchasePurpose': '매수 목적 (사업/기타)',
  'landUseOther.usePlan': '이용 계획',
  'landUseTax.sellerIsMultiHouseOwner': '매도인 다주택자 여부',
  'landUseTax.sellerHouseList': '매도인 보유 주택 목록',
  'landUseTax.sellerAcquisitionDate': '매도인 취득일',
  'landUseTax.sellerContractDate': '매매 계약일',
  'landUseTax.buyerIsNoHouse': '매수인 무주택 여부',
  'landUseTax.buyerPurchasePurpose': '매수인 매수 목적',
  'landUseTax.buyerMoveInPlan': '매수인 입주 계획',
  'landUseTax.buyerDepositReturnPlan': '보증금 반환 계획',
  'funding.depositAmount': '예금 금액',
  'funding.stockAmount': '주식·채권 매각',
  'funding.giftAmount': '증여·상속',
  'funding.cashAmount': '현금 금액',
  'funding.propertyDisposalAmount': '부동산 처분',
  'funding.compensationAmount': '보상금',
  'funding.mortgageLoan': '담보 대출',
  'funding.creditLoan': '신용 대출',
  'funding.otherLoan': '기타 대출',
  'funding.otherBorrowing': '기타 차입금',
  'privacy.consent1': '개인정보 수집·이용 동의',
  'privacy.consent2': '제3자 제공 동의',
  'privacy.consent3': '보유·이용기간 동의',
  'privacy.consent4': '고유식별정보 처리 동의',
  'proxy.principalName': '위임인 이름',
  'proxy.principalIdNumber': '위임인 주민번호',
  'proxy.principalAddress': '위임인 주소',
  'proxy.principalPhone': '위임인 연락처',
  'proxy.agentName': '대리인 이름',
  'proxy.agentIdNumber': '대리인 주민번호',
  'proxy.agentAddress': '대리인 주소',
  'proxy.agentPhone': '대리인 연락처',
  'proxy.propertyAddress': '위임 대상 부동산',
};

const PHONE_PATHS = new Set([
  'application.sellerPhone',
  'application.buyerPhone',
  'proxy.principalPhone',
  'proxy.agentPhone',
]);

const NUMBER_PATHS = new Set([
  'application.landArea',
  'application.contractAmount',
  'funding.depositAmount',
  'funding.stockAmount',
  'funding.giftAmount',
  'funding.cashAmount',
  'funding.propertyDisposalAmount',
  'funding.compensationAmount',
  'funding.mortgageLoan',
  'funding.creditLoan',
  'funding.otherLoan',
  'funding.otherBorrowing',
]);

const BOOLEAN_PATHS = new Set([
  'landUseSelf.hasExistingHouse',
  'landUseTax.sellerIsMultiHouseOwner',
  'landUseTax.buyerIsNoHouse',
]);

const CONSENT_PATHS = new Set([
  'privacy.consent1',
  'privacy.consent2',
  'privacy.consent3',
  'privacy.consent4',
]);

const ID_PATHS = new Set([
  'application.sellerIdNumber',
  'application.buyerIdNumber',
  'proxy.principalIdNumber',
  'proxy.agentIdNumber',
]);

const RADIO_OPTIONS: Record<string, { value: string; label: string }[]> = {
  'application.rightType': [
    { value: '소유권', label: '소유권' },
    { value: '지상권', label: '지상권' },
  ],
  // 추가 발견 시 여기에 등록
};

function fieldType(path: string): FieldDescriptor['type'] {
  if (ID_PATHS.has(path)) return 'split-id';
  if (RADIO_OPTIONS[path]) return 'radio';
  if (BOOLEAN_PATHS.has(path)) return 'boolean';
  if (CONSENT_PATHS.has(path)) return 'consent';
  if (PHONE_PATHS.has(path)) return 'tel';
  if (NUMBER_PATHS.has(path)) return 'number';
  return 'text';
}

function fieldPlaceholder(path: string, type: FieldDescriptor['type']): string | undefined {
  if (type === 'id' || type === 'split-id') return '990101-1******';
  if (type === 'tel') return '010-1234-5678';
  if (path === 'application.landArea') return '예: 165';
  if (path === 'application.contractAmount' || path.startsWith('funding.'))
    return '예: 1500000000 또는 15억';
  if (path.endsWith('Address')) return '예: 서울특별시 강남구 압구정동 123-45';
  if (path.endsWith('Name')) return '예: 홍길동';
  return undefined;
}

function fieldHelp(path: string, type: FieldDescriptor['type']): string | undefined {
  if (type === 'id' || type === 'split-id') return '뒷자리는 자동 마스킹됩니다';
  return undefined;
}

function getNested(obj: unknown, path: string): unknown {
  const segs = path.split('.');
  let cur: unknown = obj;
  for (const s of segs) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[s];
  }
  return cur;
}

function caseLabel(caseType: CaseType | null): string {
  if (!caseType) return '신청';
  return caseDefinitions.find((c) => c.type === caseType)?.label ?? '신청';
}

function buildSteps(caseType: CaseType): StepDef[] {
  const isProxy = caseType === 'proxy';
  return [
    { title: '거래 케이스 선택', desc: caseLabel(caseType) },
    { title: '대상 토지 확인', desc: '지목·면적·용도지역' },
    { title: '신청인 정보 입력', desc: '매수인·매도인 인적사항' },
    { title: '계약·자금 조달', desc: '거래가액 및 자금 계획' },
    { title: '이용 계획·서류 동의', desc: '이용 계획 및 개인정보 동의' },
    ...(isProxy ? [{ title: '위임장 작성', desc: '대리인 정보' }] : []),
    { title: '검토 및 제출', desc: '강남구청 처리 (최대 15일)' },
  ];
}

function progressStep(progress: number, totalSteps: number): number {
  if (progress >= 1) return totalSteps - 1;
  return Math.min(totalSteps - 1, Math.max(0, Math.floor(progress * (totalSteps - 1))));
}

interface DeriveOptions {
  forcePushStep?: boolean;
}

export function deriveSlots(
  ctx: AssistantTurnContext,
  options: DeriveOptions = {},
): RichSlot[] {
  const slots: RichSlot[] = [{ kind: 'text' }];

  if (!ctx.caseType) {
    return slots;
  }

  // 1) parcel slot if autoLookup applied
  if (ctx.autoLookup && ctx.autoLookup.applied && ctx.autoLookup.filled.length > 0) {
    const application = (ctx.answers as Record<string, unknown>).application as
      | Record<string, unknown>
      | undefined;
    const address = String(application?.landAddress ?? '');
    const lot = String(application?.landLotNumber ?? '');
    const area = String(application?.landArea ?? '');
    const zone = String(application?.landZone ?? '');
    const category = String(application?.landCategory ?? '');
    const seller = String(application?.sellerName ?? '');

    const fullAddress = [address, lot].filter(Boolean).join(' ');
    if (fullAddress) {
      slots.push({
        kind: 'parcel',
        address: fullAddress,
        jibun: lot || undefined,
        area: area ? `${area} ㎡` : undefined,
        use: [category, zone].filter(Boolean).join(' / ') || undefined,
        owner: seller || undefined,
        value: undefined,
        filled: ctx.autoLookup.filled,
        source: ctx.autoLookup.source,
      });
    }
  }

  // 2) form slot — prefer LLM-driven askFields (1~6), fallback to missingFields (≤3)
  const ask =
    ctx.askFields && ctx.askFields.length > 0
      ? ctx.askFields
      : ctx.missingFields.length <= 3
        ? ctx.missingFields
        : [];
  if (!ctx.isComplete && ask.length >= 1 && ask.length <= 6) {
    const fields: FieldDescriptor[] = ask.map((p) => {
      const t = fieldType(p);
      return {
        path: p,
        label: FIELD_LABEL[p] ?? p,
        type: t,
        placeholder: fieldPlaceholder(p, t),
        help: fieldHelp(p, t),
        required: true,
        options: t === 'radio' ? RADIO_OPTIONS[p] : undefined,
      };
    });
    slots.push({
      kind: 'form',
      title: '추가로 알려주실 정보',
      submitLabel: '이대로 보내기',
      fields,
    });
  }

  // 3) summary slot when complete
  if (ctx.isComplete) {
    const rows = buildSummaryRows(ctx.caseType, ctx.answers);
    slots.push({
      kind: 'summary',
      title: '신청서 요약 — 입력 완료',
      rows,
      allowDownload: true,
    });
  }

  // 4) step slot — push when forced (case selection or large progress jump)
  if (options.forcePushStep) {
    const steps = buildSteps(ctx.caseType);
    const current = progressStep(
      ctx.totalRequiredCount === 0
        ? 1
        : 1 - ctx.missingFields.length / ctx.totalRequiredCount,
      steps.length,
    );
    slots.push({
      kind: 'step',
      title: '신청 절차',
      current,
      steps,
    });
  }

  return slots;
}
