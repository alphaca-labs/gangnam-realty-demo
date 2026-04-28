import type { CaseType } from '@/data/land-permit';
import { caseDefinitions } from '@/data/land-permit';
import type { Answers } from '../../../types/answers';
import { maskRrnInString } from '../../../state/store';

function maskRrn(value: unknown): string {
  if (typeof value !== 'string' || !value) return '-';
  return maskRrnInString(value);
}

function asString(value: unknown): string {
  if (value == null || value === '') return '-';
  if (typeof value === 'boolean') return value ? '예' : '아니오';
  return String(value);
}

function joinAddress(addr: unknown, lot: unknown): string {
  const a = typeof addr === 'string' ? addr.trim() : '';
  const l = typeof lot === 'string' ? lot.trim() : '';
  const out = [a, l].filter(Boolean).join(' ');
  return out || '-';
}

function nested(obj: Answers, key: string): Record<string, unknown> | undefined {
  const v = (obj as Record<string, unknown>)[key];
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return undefined;
}

export function buildSummaryRows(caseType: CaseType, answers: Answers): Array<[string, string]> {
  const application = nested(answers, 'application') ?? {};
  const funding = nested(answers, 'funding') ?? {};
  const def = caseDefinitions.find((c) => c.type === caseType);

  const rows: Array<[string, string]> = [];
  rows.push(['신청 케이스', def?.label ?? '-']);
  rows.push(['거래 권리', asString(application.rightType)]);
  rows.push(['대상 토지', joinAddress(application.landAddress, application.landLotNumber)]);
  rows.push([
    '면적 / 지목',
    [
      application.landArea ? `${asString(application.landArea)} ㎡` : '',
      asString(application.landCategory),
    ]
      .filter((s) => s && s !== '-')
      .join(' · ') || '-',
  ]);
  rows.push(['용도지역', asString(application.landZone)]);
  rows.push(['매수인', asString(application.buyerName)]);
  rows.push(['매수인 주민번호', maskRrn(application.buyerIdNumber)]);
  rows.push(['매수인 연락처', asString(application.buyerPhone)]);
  rows.push(['매도인', asString(application.sellerName)]);
  rows.push(['매도인 주민번호', maskRrn(application.sellerIdNumber)]);
  rows.push(['매도인 연락처', asString(application.sellerPhone)]);
  rows.push(['계약예정금액', application.contractAmount ? `${asString(application.contractAmount)} 원` : '-']);

  if (caseType === 'self-occupy' || caseType === 'proxy') {
    const self = nested(answers, 'landUseSelf') ?? {};
    rows.push(['매수 목적', asString(self.purchasePurpose)]);
    rows.push(['이용 계획', asString(self.usePlan)]);
    rows.push(['기존 주택 보유', asString(self.hasExistingHouse)]);
    rows.push(['입주 예정일', asString(self.moveInDate)]);
  } else if (caseType === 'non-residential') {
    const other = nested(answers, 'landUseOther') ?? {};
    rows.push(['매수 목적', asString(other.purchasePurpose)]);
    rows.push(['이용 계획', asString(other.usePlan)]);
  } else if (caseType === 'tax-deferral') {
    const tax = nested(answers, 'landUseTax') ?? {};
    rows.push(['매도인 다주택자', asString(tax.sellerIsMultiHouseOwner)]);
    rows.push(['매도인 취득일', asString(tax.sellerAcquisitionDate)]);
    rows.push(['매수인 무주택', asString(tax.buyerIsNoHouse)]);
    rows.push(['매수인 매수 목적', asString(tax.buyerPurchasePurpose)]);
  }

  rows.push(['예금 자금', funding.depositAmount ? `${asString(funding.depositAmount)} 원` : '-']);
  rows.push(['현금 자금', funding.cashAmount ? `${asString(funding.cashAmount)} 원` : '-']);
  rows.push(['담보 대출', funding.mortgageLoan ? `${asString(funding.mortgageLoan)} 원` : '-']);

  if (caseType === 'proxy') {
    const proxy = nested(answers, 'proxy') ?? {};
    rows.push(['대리인', asString(proxy.agentName)]);
    rows.push(['대리인 주민번호', maskRrn(proxy.agentIdNumber)]);
    rows.push(['위임인', asString(proxy.principalName)]);
    rows.push(['위임인 주민번호', maskRrn(proxy.principalIdNumber)]);
  }

  return rows;
}
