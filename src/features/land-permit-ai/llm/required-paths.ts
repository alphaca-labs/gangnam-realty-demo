import type { CaseType } from '@/data/land-permit';

const APPLICATION_BASE = [
  'application.sellerName',
  'application.sellerIdNumber',
  'application.sellerAddress',
  'application.sellerPhone',
  'application.buyerName',
  'application.buyerIdNumber',
  'application.buyerAddress',
  'application.buyerPhone',
  'application.rightType',
  'application.landAddress',
  'application.landLotNumber',
  'application.landCategory',
  'application.landArea',
  'application.landZone',
  'application.contractAmount',
];

const FUNDING_BASE = [
  'funding.depositAmount',
  'funding.cashAmount',
  'funding.mortgageLoan',
];

const PRIVACY_BASE = [
  'privacy.consent1',
  'privacy.consent2',
  'privacy.consent3',
  'privacy.consent4',
];

const LAND_USE_SELF = [
  'landUseSelf.purchasePurpose',
  'landUseSelf.usePlan',
  'landUseSelf.hasExistingHouse',
  'landUseSelf.moveInDate',
];

const LAND_USE_OTHER = [
  'landUseOther.purchasePurpose',
  'landUseOther.usePlan',
];

const LAND_USE_TAX = [
  'landUseTax.sellerIsMultiHouseOwner',
  'landUseTax.sellerHouseList',
  'landUseTax.sellerAcquisitionDate',
  'landUseTax.sellerContractDate',
  'landUseTax.buyerIsNoHouse',
  'landUseTax.buyerPurchasePurpose',
  'landUseTax.buyerMoveInPlan',
  'landUseTax.buyerDepositReturnPlan',
];

const PROXY = [
  'proxy.principalName',
  'proxy.principalIdNumber',
  'proxy.principalAddress',
  'proxy.principalPhone',
  'proxy.agentName',
  'proxy.agentIdNumber',
  'proxy.agentAddress',
  'proxy.agentPhone',
  'proxy.propertyAddress',
];

export function getRequiredPaths(caseType: CaseType): string[] {
  switch (caseType) {
    case 'self-occupy':
      return [...APPLICATION_BASE, ...LAND_USE_SELF, ...FUNDING_BASE, ...PRIVACY_BASE];
    case 'non-residential':
      return [...APPLICATION_BASE, ...LAND_USE_OTHER, ...FUNDING_BASE, ...PRIVACY_BASE];
    case 'tax-deferral':
      return [...APPLICATION_BASE, ...LAND_USE_TAX, ...FUNDING_BASE, ...PRIVACY_BASE];
    case 'proxy':
      return [...APPLICATION_BASE, ...LAND_USE_SELF, ...FUNDING_BASE, ...PRIVACY_BASE, ...PROXY];
  }
}

function getNested(obj: Record<string, unknown>, path: string): unknown {
  if (!path) return undefined;
  const segs = path.split('.');
  let cur: unknown = obj;
  for (const s of segs) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[s];
  }
  return cur;
}

export function computeMissingFields(
  caseType: CaseType,
  answers: Record<string, unknown>,
): string[] {
  const required = getRequiredPaths(caseType);
  const missing: string[] = [];
  for (const path of required) {
    const v = getNested(answers, path);
    if (v == null) {
      missing.push(path);
      continue;
    }
    if (typeof v === 'string' && v.trim() === '') {
      missing.push(path);
      continue;
    }
  }
  return missing;
}
