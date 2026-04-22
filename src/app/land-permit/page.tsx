'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Info,
  Download,
  FileText,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import {
  type CaseType,
  caseDefinitions,
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
  consentItems,
} from '@/data/land-permit';
import {
  generateApplicationHtml,
  generateLandUseSelfHtml,
  generateLandUseOtherHtml,
  generateLandUseTaxSellerHtml,
  generateLandUseTaxBuyerHtml,
  generateFundingPlanHtml,
  generatePrivacyConsentHtml,
  generateProxyHtml,
} from '@/lib/land-permit-html';
import { generatePermitZip } from '@/lib/zip-generator';

/* ─── Step definitions per case ─── */

interface StepDef {
  id: number;
  label: string;
  icon: typeof FileText;
}

function getSteps(caseType: CaseType): StepDef[] {
  const base: StepDef[] = [
    { id: 1, label: '허가신청서', icon: FileText },
    { id: 2, label: '토지이용계획서', icon: FileText },
    { id: 3, label: '자금조달계획서', icon: FileText },
    { id: 4, label: '개인정보동의서', icon: FileCheck },
  ];
  if (caseType === 'proxy') {
    base.push({ id: 5, label: '위임장', icon: FileText });
  }
  return base;
}

/* ─── Toggle component ─── */

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4D8E]/50 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-[#10A37F]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

/* ─── Label + Input wrapper ─── */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1A1A2E]">{label}</label>
      {children}
    </div>
  );
}

/* ─── Styled text input ─── */

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="h-10 w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1A2E] transition-colors outline-none placeholder:text-[#9CA3AF] focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
    />
  );
}

/* ─── Styled textarea ─── */

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm text-[#1A1A2E] transition-colors outline-none placeholder:text-[#9CA3AF] focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20"
    />
  );
}

/* ─── Section divider ─── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
      <div className="h-4 w-1 rounded-full bg-[#1B4D8E]" />
      <h3 className="text-sm font-semibold text-[#1B4D8E]">{children}</h3>
    </div>
  );
}

/* ─── Funding plan amount parser/formatter helpers ─── */

function parseAmountStr(v: string): number {
  return parseInt(v.replace(/[^0-9]/g, ''), 10) || 0;
}

function formatAmount(n: number): string {
  if (n === 0) return '0';
  return n.toLocaleString('ko-KR');
}

function formatKrw(n: number): string {
  if (n === 0) return '0원';
  const eok = Math.floor(n / 100000000);
  const man = Math.floor((n % 100000000) / 10000);
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok}억`);
  if (man > 0) parts.push(`${man.toLocaleString('ko-KR')}만`);
  if (parts.length === 0) return `${n.toLocaleString('ko-KR')}원`;
  return parts.join(' ') + '원';
}

/* ═══════════════════════════════════════════════════ */
/* ─── Main page component ─── */
/* ═══════════════════════════════════════════════════ */

export default function LandPermitPage() {
  /* ─── State ─── */
  const [caseType, setCaseType] = useState<CaseType | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [applicationData, setApplicationData] = useState<ApplicationFormData>(initialApplicationData);
  const [landUseSelfData, setLandUseSelfData] = useState<LandUsePlanSelfFormData>(initialLandUseSelfData);
  const [landUseOtherData, setLandUseOtherData] = useState<LandUsePlanOtherFormData>(initialLandUseOtherData);
  const [landUseTaxData, setLandUseTaxData] = useState<LandUsePlanTaxFormData>(initialLandUseTaxData);
  const [fundingData, setFundingData] = useState<FundingPlanFormData>(initialFundingData);
  const [privacyData, setPrivacyData] = useState<PrivacyConsentFormData>(initialPrivacyData);
  const [proxyData, setProxyData] = useState<ProxyFormData>(initialProxyData);

  const showCaseSelector = caseType === null;
  const steps = caseType ? getSteps(caseType) : [];
  const totalSteps = steps.length;

  /* ─── Updaters ─── */
  function updateApp<K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) {
    setApplicationData((prev) => ({ ...prev, [key]: value }));
  }
  function updateSelf<K extends keyof LandUsePlanSelfFormData>(key: K, value: LandUsePlanSelfFormData[K]) {
    setLandUseSelfData((prev) => ({ ...prev, [key]: value }));
  }
  function updateOther<K extends keyof LandUsePlanOtherFormData>(key: K, value: LandUsePlanOtherFormData[K]) {
    setLandUseOtherData((prev) => ({ ...prev, [key]: value }));
  }
  function updateTax<K extends keyof LandUsePlanTaxFormData>(key: K, value: LandUsePlanTaxFormData[K]) {
    setLandUseTaxData((prev) => ({ ...prev, [key]: value }));
  }
  function updateFunding<K extends keyof FundingPlanFormData>(key: K, value: FundingPlanFormData[K]) {
    setFundingData((prev) => ({ ...prev, [key]: value }));
  }
  function updatePrivacy<K extends keyof PrivacyConsentFormData>(key: K, value: PrivacyConsentFormData[K]) {
    setPrivacyData((prev) => ({ ...prev, [key]: value }));
  }
  function updateProxy<K extends keyof ProxyFormData>(key: K, value: ProxyFormData[K]) {
    setProxyData((prev) => ({ ...prev, [key]: value }));
  }

  /* ─── Funding totals ─── */
  const selfFundTotal = useMemo(() => {
    return (
      parseAmountStr(fundingData.depositAmount) +
      parseAmountStr(fundingData.stockAmount) +
      parseAmountStr(fundingData.giftAmount) +
      parseAmountStr(fundingData.cashAmount) +
      parseAmountStr(fundingData.propertyDisposalAmount) +
      parseAmountStr(fundingData.compensationAmount)
    );
  }, [fundingData.depositAmount, fundingData.stockAmount, fundingData.giftAmount, fundingData.cashAmount, fundingData.propertyDisposalAmount, fundingData.compensationAmount]);

  const borrowTotal = useMemo(() => {
    return (
      parseAmountStr(fundingData.mortgageLoan) +
      parseAmountStr(fundingData.creditLoan) +
      parseAmountStr(fundingData.otherLoan) +
      parseAmountStr(fundingData.otherBorrowing)
    );
  }, [fundingData.mortgageLoan, fundingData.creditLoan, fundingData.otherLoan, fundingData.otherBorrowing]);

  const grandTotal = selfFundTotal + borrowTotal;

  /* ─── Select case ─── */
  function selectCase(type: CaseType) {
    setCaseType(type);
    setCurrentStep(1);
    setShowPreview(false);
    setShowDownloadSuccess(false);
  }

  function resetToSelector() {
    setCaseType(null);
    setCurrentStep(1);
    setShowPreview(false);
    setShowDownloadSuccess(false);
  }

  /* ─── Build document list for ZIP ─── */
  const buildDocuments = useCallback(() => {
    if (!caseType) return [];
    const docs: Array<{ filename: string; html: string }> = [];

    // 1. 허가신청서 (공통)
    docs.push({
      filename: '01_토지거래계약_허가신청서',
      html: generateApplicationHtml(applicationData),
    });

    // 2. 토지이용계획서 (케이스별)
    if (caseType === 'self-occupy' || caseType === 'proxy') {
      docs.push({
        filename: '02_토지이용계획서_자기거주용',
        html: generateLandUseSelfHtml(landUseSelfData),
      });
    } else if (caseType === 'non-residential') {
      docs.push({
        filename: '02_토지이용계획서_기타용',
        html: generateLandUseOtherHtml(landUseOtherData),
      });
    } else if (caseType === 'tax-deferral') {
      docs.push({
        filename: '02-1_토지이용계획서_매도인용',
        html: generateLandUseTaxSellerHtml(landUseTaxData),
      });
      docs.push({
        filename: '02-2_토지이용계획서_매수인용',
        html: generateLandUseTaxBuyerHtml(landUseTaxData),
      });
    }

    // 3. 자금조달계획서 (공통)
    docs.push({
      filename: '03_자금조달계획서',
      html: generateFundingPlanHtml(fundingData),
    });

    // 4. 개인정보동의서 (공통)
    docs.push({
      filename: '04_개인정보_수집이용_동의서',
      html: generatePrivacyConsentHtml(privacyData),
    });

    // 5. 위임장 (대리 신청 시)
    if (caseType === 'proxy') {
      docs.push({
        filename: '05_위임장',
        html: generateProxyHtml(proxyData),
      });
    }

    return docs;
  }, [caseType, applicationData, landUseSelfData, landUseOtherData, landUseTaxData, fundingData, privacyData, proxyData]);

  /* ─── Download handler ─── */
  async function handleDownload() {
    setIsDownloading(true);
    try {
      const docs = buildDocuments();
      const blob = await generatePermitZip(docs);

      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const filename = `토지거래허가_서류_${dateStr}.zip`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowDownloadSuccess(true);
      setTimeout(() => setShowDownloadSuccess(false), 4000);
    } finally {
      setIsDownloading(false);
    }
  }

  /* ═══════════════════════════════════════════════════ */
  /* ─── Step form renderers ─── */
  /* ═══════════════════════════════════════════════════ */

  function renderStep1Application() {
    return (
      <div className="grid gap-5">
        <SectionTitle>매도인 (양도인) 정보</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="성명">
            <TextInput value={applicationData.sellerName} onChange={(v) => updateApp('sellerName', v)} />
          </FormField>
          <FormField label="주민등록번호">
            <TextInput value={applicationData.sellerIdNumber} onChange={(v) => updateApp('sellerIdNumber', v)} />
          </FormField>
        </div>
        <FormField label="주소">
          <TextInput value={applicationData.sellerAddress} onChange={(v) => updateApp('sellerAddress', v)} />
        </FormField>
        <FormField label="전화번호">
          <TextInput value={applicationData.sellerPhone} onChange={(v) => updateApp('sellerPhone', v)} />
        </FormField>

        <SectionTitle>매수인 (양수인) 정보</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="성명">
            <TextInput value={applicationData.buyerName} onChange={(v) => updateApp('buyerName', v)} />
          </FormField>
          <FormField label="주민등록번호">
            <TextInput value={applicationData.buyerIdNumber} onChange={(v) => updateApp('buyerIdNumber', v)} />
          </FormField>
        </div>
        <FormField label="주소">
          <TextInput value={applicationData.buyerAddress} onChange={(v) => updateApp('buyerAddress', v)} />
        </FormField>
        <FormField label="전화번호">
          <TextInput value={applicationData.buyerPhone} onChange={(v) => updateApp('buyerPhone', v)} />
        </FormField>

        <SectionTitle>허가 권리</SectionTitle>
        <FormField label="권리 유형">
          <select
            value={applicationData.rightType}
            onChange={(e) => updateApp('rightType', e.target.value as '소유권' | '지상권')}
            className="h-10 w-full appearance-none rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1A2E] transition-colors outline-none focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20"
          >
            <option value="소유권">소유권</option>
            <option value="지상권">지상권</option>
          </select>
        </FormField>

        <SectionTitle>토지의 표시</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="소재지">
            <TextInput value={applicationData.landAddress} onChange={(v) => updateApp('landAddress', v)} />
          </FormField>
          <FormField label="지번">
            <TextInput value={applicationData.landLotNumber} onChange={(v) => updateApp('landLotNumber', v)} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField label="지목">
            <TextInput value={applicationData.landCategory} onChange={(v) => updateApp('landCategory', v)} />
          </FormField>
          <FormField label="면적 (m²)">
            <TextInput value={applicationData.landArea} onChange={(v) => updateApp('landArea', v)} />
          </FormField>
          <FormField label="용도지역">
            <TextInput value={applicationData.landZone} onChange={(v) => updateApp('landZone', v)} />
          </FormField>
        </div>
        <FormField label="계약예정금액 (원)">
          <TextInput value={applicationData.contractAmount} onChange={(v) => updateApp('contractAmount', v)} />
        </FormField>
      </div>
    );
  }

  function renderStep2LandUseSelf() {
    return (
      <div className="grid gap-5">
        <SectionTitle>신청인 정보</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="성명">
            <TextInput value={landUseSelfData.applicantName} onChange={(v) => updateSelf('applicantName', v)} />
          </FormField>
          <FormField label="생년월일">
            <TextInput value={landUseSelfData.applicantBirth} onChange={(v) => updateSelf('applicantBirth', v)} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="전화번호">
            <TextInput value={landUseSelfData.applicantPhone} onChange={(v) => updateSelf('applicantPhone', v)} />
          </FormField>
          <FormField label="주소">
            <TextInput value={landUseSelfData.applicantAddress} onChange={(v) => updateSelf('applicantAddress', v)} />
          </FormField>
        </div>

        <SectionTitle>토지 현황</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="소재지">
            <TextInput value={landUseSelfData.landAddress} onChange={(v) => updateSelf('landAddress', v)} />
          </FormField>
          <FormField label="지번">
            <TextInput value={landUseSelfData.landLotNumber} onChange={(v) => updateSelf('landLotNumber', v)} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField label="지목">
            <TextInput value={landUseSelfData.landCategory} onChange={(v) => updateSelf('landCategory', v)} />
          </FormField>
          <FormField label="면적 (m²)">
            <TextInput value={landUseSelfData.landArea} onChange={(v) => updateSelf('landArea', v)} />
          </FormField>
          <FormField label="용도지역">
            <TextInput value={landUseSelfData.landZone} onChange={(v) => updateSelf('landZone', v)} />
          </FormField>
        </div>

        <SectionTitle>이용계획</SectionTitle>
        <FormField label="매수 목적">
          <TextInput value={landUseSelfData.purchasePurpose} onChange={(v) => updateSelf('purchasePurpose', v)} />
        </FormField>
        <FormField label="이용계획">
          <TextInput value={landUseSelfData.usePlan} onChange={(v) => updateSelf('usePlan', v)} />
        </FormField>

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">기존 주택 보유 여부</span>
          <Toggle
            checked={landUseSelfData.hasExistingHouse}
            onChange={(v) => updateSelf('hasExistingHouse', v)}
          />
        </div>

        {landUseSelfData.hasExistingHouse && (
          <FormField label="기존 주택 처분계획">
            <TextInput value={landUseSelfData.existingHouseDisposal} onChange={(v) => updateSelf('existingHouseDisposal', v)} />
          </FormField>
        )}

        <FormField label="입주 예정일">
          <TextInput value={landUseSelfData.moveInDate} onChange={(v) => updateSelf('moveInDate', v)} type="date" />
        </FormField>
      </div>
    );
  }

  function renderStep2LandUseOther() {
    return (
      <div className="grid gap-5">
        <SectionTitle>신청인 정보</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="성명">
            <TextInput value={landUseOtherData.applicantName} onChange={(v) => updateOther('applicantName', v)} />
          </FormField>
          <FormField label="생년월일">
            <TextInput value={landUseOtherData.applicantBirth} onChange={(v) => updateOther('applicantBirth', v)} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="전화번호">
            <TextInput value={landUseOtherData.applicantPhone} onChange={(v) => updateOther('applicantPhone', v)} />
          </FormField>
          <FormField label="주소">
            <TextInput value={landUseOtherData.applicantAddress} onChange={(v) => updateOther('applicantAddress', v)} />
          </FormField>
        </div>

        <SectionTitle>토지 현황</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="소재지">
            <TextInput value={landUseOtherData.landAddress} onChange={(v) => updateOther('landAddress', v)} />
          </FormField>
          <FormField label="지번">
            <TextInput value={landUseOtherData.landLotNumber} onChange={(v) => updateOther('landLotNumber', v)} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField label="지목">
            <TextInput value={landUseOtherData.landCategory} onChange={(v) => updateOther('landCategory', v)} />
          </FormField>
          <FormField label="면적 (m²)">
            <TextInput value={landUseOtherData.landArea} onChange={(v) => updateOther('landArea', v)} />
          </FormField>
          <FormField label="용도지역">
            <TextInput value={landUseOtherData.landZone} onChange={(v) => updateOther('landZone', v)} />
          </FormField>
        </div>

        <SectionTitle>이용계획</SectionTitle>
        <FormField label="매수 목적">
          <TextArea value={landUseOtherData.purchasePurpose} onChange={(v) => updateOther('purchasePurpose', v)} rows={3} />
        </FormField>
        <FormField label="이용계획 상세">
          <TextArea value={landUseOtherData.usePlan} onChange={(v) => updateOther('usePlan', v)} rows={3} />
        </FormField>
      </div>
    );
  }

  function renderStep2LandUseTax() {
    return (
      <div className="grid gap-5">
        <SectionTitle>신청인 정보</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="성명">
            <TextInput value={landUseTaxData.applicantName} onChange={(v) => updateTax('applicantName', v)} />
          </FormField>
          <FormField label="생년월일">
            <TextInput value={landUseTaxData.applicantBirth} onChange={(v) => updateTax('applicantBirth', v)} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="전화번호">
            <TextInput value={landUseTaxData.applicantPhone} onChange={(v) => updateTax('applicantPhone', v)} />
          </FormField>
          <FormField label="주소">
            <TextInput value={landUseTaxData.applicantAddress} onChange={(v) => updateTax('applicantAddress', v)} />
          </FormField>
        </div>

        <SectionTitle>토지 현황</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="소재지">
            <TextInput value={landUseTaxData.landAddress} onChange={(v) => updateTax('landAddress', v)} />
          </FormField>
          <FormField label="지번">
            <TextInput value={landUseTaxData.landLotNumber} onChange={(v) => updateTax('landLotNumber', v)} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField label="지목">
            <TextInput value={landUseTaxData.landCategory} onChange={(v) => updateTax('landCategory', v)} />
          </FormField>
          <FormField label="면적 (m²)">
            <TextInput value={landUseTaxData.landArea} onChange={(v) => updateTax('landArea', v)} />
          </FormField>
          <FormField label="용도지역">
            <TextInput value={landUseTaxData.landZone} onChange={(v) => updateTax('landZone', v)} />
          </FormField>
        </div>

        <SectionTitle>매도인 확인사항</SectionTitle>
        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">다주택자 여부</span>
          <Toggle
            checked={landUseTaxData.sellerIsMultiHouseOwner}
            onChange={(v) => updateTax('sellerIsMultiHouseOwner', v)}
          />
        </div>
        <FormField label="보유 주택 목록">
          <TextArea value={landUseTaxData.sellerHouseList} onChange={(v) => updateTax('sellerHouseList', v)} rows={3} />
        </FormField>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="취득일">
            <TextInput value={landUseTaxData.sellerAcquisitionDate} onChange={(v) => updateTax('sellerAcquisitionDate', v)} type="date" />
          </FormField>
          <FormField label="계약 예정일">
            <TextInput value={landUseTaxData.sellerContractDate} onChange={(v) => updateTax('sellerContractDate', v)} type="date" />
          </FormField>
        </div>

        <SectionTitle>매수인 확인사항</SectionTitle>
        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">무주택 여부</span>
          <Toggle
            checked={landUseTaxData.buyerIsNoHouse}
            onChange={(v) => updateTax('buyerIsNoHouse', v)}
          />
        </div>
        <FormField label="매수 목적">
          <TextInput value={landUseTaxData.buyerPurchasePurpose} onChange={(v) => updateTax('buyerPurchasePurpose', v)} />
        </FormField>
        <FormField label="입주 계획">
          <TextInput value={landUseTaxData.buyerMoveInPlan} onChange={(v) => updateTax('buyerMoveInPlan', v)} />
        </FormField>
        <FormField label="보증금 반환 계획">
          <TextArea value={landUseTaxData.buyerDepositReturnPlan} onChange={(v) => updateTax('buyerDepositReturnPlan', v)} rows={2} />
        </FormField>
      </div>
    );
  }

  function renderStep3Funding() {
    return (
      <div className="grid gap-5">
        <SectionTitle>자기자금</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="금융기관 예금액">
            <TextInput value={fundingData.depositAmount} onChange={(v) => updateFunding('depositAmount', v)} placeholder="0" />
          </FormField>
          <FormField label="주식·채권 매각대금">
            <TextInput value={fundingData.stockAmount} onChange={(v) => updateFunding('stockAmount', v)} placeholder="0" />
          </FormField>
          <FormField label="증여·상속">
            <TextInput value={fundingData.giftAmount} onChange={(v) => updateFunding('giftAmount', v)} placeholder="0" />
          </FormField>
          <FormField label="현금 등 기타">
            <TextInput value={fundingData.cashAmount} onChange={(v) => updateFunding('cashAmount', v)} placeholder="0" />
          </FormField>
          <FormField label="부동산 처분대금">
            <TextInput value={fundingData.propertyDisposalAmount} onChange={(v) => updateFunding('propertyDisposalAmount', v)} placeholder="0" />
          </FormField>
          <FormField label="보상금">
            <TextInput value={fundingData.compensationAmount} onChange={(v) => updateFunding('compensationAmount', v)} placeholder="0" />
          </FormField>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-[#10A37F]/20 bg-[#10A37F]/5 px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">자기자금 소계</span>
          <span className="text-sm font-bold text-[#10A37F]">{formatKrw(selfFundTotal)}</span>
        </div>

        <SectionTitle>차입금</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="금융기관 대출 (토지담보)">
            <TextInput value={fundingData.mortgageLoan} onChange={(v) => updateFunding('mortgageLoan', v)} placeholder="0" />
          </FormField>
          <FormField label="금융기관 대출 (신용)">
            <TextInput value={fundingData.creditLoan} onChange={(v) => updateFunding('creditLoan', v)} placeholder="0" />
          </FormField>
          <FormField label="금융기관 대출 (기타)">
            <TextInput value={fundingData.otherLoan} onChange={(v) => updateFunding('otherLoan', v)} placeholder="0" />
          </FormField>
          <FormField label="기타 차입금">
            <TextInput value={fundingData.otherBorrowing} onChange={(v) => updateFunding('otherBorrowing', v)} placeholder="0" />
          </FormField>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-[#1B4D8E]/20 bg-[#1B4D8E]/5 px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">차입금 소계</span>
          <span className="text-sm font-bold text-[#1B4D8E]">{formatKrw(borrowTotal)}</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border-2 border-[#1B4D8E] bg-[#E3F2FD] px-5 py-4">
          <span className="text-base font-bold text-[#1A1A2E]">조달자금 합계</span>
          <span className="text-lg font-bold text-[#1B4D8E]">{formatKrw(grandTotal)}</span>
        </div>
      </div>
    );
  }

  function renderStep4Privacy() {
    return (
      <div className="grid gap-5">
        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl border border-[#1B4D8E]/20 bg-[#E3F2FD] px-4 py-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#1B4D8E]" />
          <div>
            <p className="text-sm font-medium text-[#1B4D8E]">개인정보 수집·이용 안내</p>
            <p className="text-sm text-[#1B4D8E]/80">
              토지거래허가 심사를 위해 아래 개인정보 수집에 동의가 필요합니다.
            </p>
          </div>
        </div>

        <SectionTitle>동의 항목</SectionTitle>
        {consentItems.map((item, idx) => {
          const key = `consent${idx + 1}` as keyof PrivacyConsentFormData;
          const checked = privacyData[key] as boolean;
          return (
            <label
              key={idx}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 transition-colors hover:bg-[#F7F7F8]"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => updatePrivacy(key, e.target.checked)}
                className="h-4 w-4 rounded border-[#D1D5DB] accent-[#10A37F]"
              />
              <span className="text-sm text-[#1A1A2E]">{item}</span>
            </label>
          );
        })}

        <SectionTitle>동의인 정보</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField label="성명">
            <TextInput value={privacyData.name} onChange={(v) => updatePrivacy('name', v)} />
          </FormField>
          <FormField label="생년월일">
            <TextInput value={privacyData.birth} onChange={(v) => updatePrivacy('birth', v)} />
          </FormField>
          <FormField label="전화번호">
            <TextInput value={privacyData.phone} onChange={(v) => updatePrivacy('phone', v)} />
          </FormField>
        </div>
      </div>
    );
  }

  function renderStep5Proxy() {
    return (
      <div className="grid gap-5">
        <SectionTitle>위임인 (본인) 정보</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="성명">
            <TextInput value={proxyData.principalName} onChange={(v) => updateProxy('principalName', v)} />
          </FormField>
          <FormField label="주민등록번호">
            <TextInput value={proxyData.principalIdNumber} onChange={(v) => updateProxy('principalIdNumber', v)} />
          </FormField>
        </div>
        <FormField label="주소">
          <TextInput value={proxyData.principalAddress} onChange={(v) => updateProxy('principalAddress', v)} />
        </FormField>
        <FormField label="연락처">
          <TextInput value={proxyData.principalPhone} onChange={(v) => updateProxy('principalPhone', v)} />
        </FormField>

        <SectionTitle>수임인 (대리인) 정보</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="성명">
            <TextInput value={proxyData.agentName} onChange={(v) => updateProxy('agentName', v)} />
          </FormField>
          <FormField label="주민등록번호">
            <TextInput value={proxyData.agentIdNumber} onChange={(v) => updateProxy('agentIdNumber', v)} />
          </FormField>
        </div>
        <FormField label="주소">
          <TextInput value={proxyData.agentAddress} onChange={(v) => updateProxy('agentAddress', v)} />
        </FormField>
        <FormField label="연락처">
          <TextInput value={proxyData.agentPhone} onChange={(v) => updateProxy('agentPhone', v)} />
        </FormField>

        <SectionTitle>부동산 정보</SectionTitle>
        <FormField label="부동산 소재지">
          <TextInput value={proxyData.propertyAddress} onChange={(v) => updateProxy('propertyAddress', v)} />
        </FormField>
      </div>
    );
  }

  /* ─── Step content router ─── */
  function renderCurrentStep() {
    if (!caseType) return null;

    if (currentStep === 1) return renderStep1Application();

    if (currentStep === 2) {
      if (caseType === 'self-occupy' || caseType === 'proxy') return renderStep2LandUseSelf();
      if (caseType === 'non-residential') return renderStep2LandUseOther();
      if (caseType === 'tax-deferral') return renderStep2LandUseTax();
    }

    if (currentStep === 3) return renderStep3Funding();
    if (currentStep === 4) return renderStep4Privacy();
    if (currentStep === 5 && caseType === 'proxy') return renderStep5Proxy();

    return null;
  }

  /* ═══════════════════════════════════════════════════ */
  /* ─── Preview panel ─── */
  /* ═══════════════════════════════════════════════════ */

  function renderPreview() {
    if (!caseType) return null;
    const caseDef = caseDefinitions.find((c) => c.type === caseType)!;
    const docs = buildDocuments();

    return (
      <div className="flex flex-col gap-6">
        {/* Download success alert */}
        {showDownloadSuccess && (
          <div className="flex items-center gap-3 rounded-xl border border-[#10A37F]/30 bg-[#10A37F]/10 px-4 py-3 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#10A37F]" />
            <p className="text-sm font-medium text-[#10A37F]">서류가 성공적으로 다운로드되었습니다!</p>
          </div>
        )}

        {/* Summary card */}
        <div className="rounded-2xl border-2 border-[#1B4D8E]/30 bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="mb-6 border-b-2 border-[#1B4D8E] pb-4 text-center">
            <p className="text-xs tracking-widest text-[#6B7280]">토지거래허가 서류 패키지</p>
            <h2 className="mt-1 text-xl font-bold text-[#1A1A2E] sm:text-2xl">
              서류 미리보기
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              {caseDef.iconEmoji} {caseDef.label} · 총 {docs.length}개 서류
            </p>
          </div>

          {/* Document list */}
          <div className="grid gap-3">
            {docs.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4D8E] text-xs font-bold text-white">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A2E] truncate">{doc.filename}.pdf</p>
                </div>
                <FileText className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
              </div>
            ))}
          </div>

          {/* Key info summary */}
          <div className="mt-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">i</span>
              주요 정보 요약
            </h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-medium text-[#6B7280]">매도인</span>
              <span className="text-[#1A1A2E]">{applicationData.sellerName}</span>
              <span className="font-medium text-[#6B7280]">매수인</span>
              <span className="text-[#1A1A2E]">{applicationData.buyerName}</span>
              <span className="font-medium text-[#6B7280]">토지 소재지</span>
              <span className="text-[#1A1A2E]">{applicationData.landAddress} {applicationData.landLotNumber}</span>
              <span className="font-medium text-[#6B7280]">면적</span>
              <span className="text-[#1A1A2E]">{applicationData.landArea} m²</span>
              <span className="font-medium text-[#6B7280]">계약예정금액</span>
              <span className="text-[#1A1A2E]">{applicationData.contractAmount}원</span>
              <span className="font-medium text-[#6B7280]">조달자금 합계</span>
              <span className="text-[#1A1A2E] font-medium">{formatKrw(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => setShowPreview(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#1A1A2E] shadow-sm transition-colors hover:bg-[#F7F7F8] sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4" />
            돌아가기
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10A37F] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0D8C6D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? 'PDF 생성 중...' : '.zip 다운로드 (PDF)'}
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════ */
  /* ─── Step indicator ─── */
  /* ═══════════════════════════════════════════════════ */

  function renderStepIndicator() {
    return (
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => {
                    if (step.id <= currentStep) {
                      setCurrentStep(step.id);
                      setShowPreview(false);
                    }
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    isCompleted
                      ? 'border-[#10A37F] bg-[#10A37F] text-white cursor-pointer'
                      : isActive
                        ? 'border-[#1B4D8E] bg-[#1B4D8E] text-white cursor-default'
                        : 'border-[#D1D5DB] bg-white text-[#9CA3AF] cursor-default'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </button>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    isActive
                      ? 'text-[#1B4D8E]'
                      : isCompleted
                        ? 'text-[#10A37F]'
                        : 'text-[#9CA3AF]'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`mx-1 mb-5 h-0.5 w-6 sm:w-10 md:w-14 ${
                    step.id < currentStep ? 'bg-[#10A37F]' : 'bg-[#E5E7EB]'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════ */
  /* ─── Case selector ─── */
  /* ═══════════════════════════════════════════════════ */

  function renderCaseSelector() {
    return (
      <div className="flex flex-col gap-6">
        {/* 2x2 grid of case cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {caseDefinitions.map((caseDef) => (
            <button
              key={caseDef.type}
              onClick={() => selectCase(caseDef.type)}
              className="group flex flex-col items-start gap-3 rounded-2xl border-2 border-[#E5E7EB] bg-white p-5 text-left shadow-sm transition-all duration-200 hover:border-[#1B4D8E] hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{caseDef.iconEmoji}</span>
                <h3 className="text-base font-bold text-[#1A1A2E] group-hover:text-[#1B4D8E]">
                  {caseDef.label}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[#6B7280]">
                {caseDef.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {caseDef.documents.map((doc) => (
                  <span
                    key={doc}
                    className="rounded-md bg-[#F0F4F8] px-2 py-0.5 text-xs font-medium text-[#1B4D8E]"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl border border-[#1B4D8E]/20 bg-[#E3F2FD] px-4 py-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#1B4D8E]" />
          <div>
            <p className="text-sm font-medium text-[#1B4D8E]">안내</p>
            <p className="text-sm text-[#1B4D8E]/80">
              처리기간: 15일 이내 · 수수료: 없음 · 관할: 토지 소재지 시·군·구청
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════ */
  /* ─── Main render ─── */
  /* ═══════════════════════════════════════════════════ */

  return (
    <div className="flex h-full flex-col overflow-y-auto pt-14 lg:pt-0">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E3F2FD]">
            <FileCheck className="h-6 w-6 text-[#1B4D8E]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">
            토지거래허가 서류 도우미
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            거래 유형을 선택하면 필요한 서류를 단계별로 안내해 드립니다
          </p>
        </div>

        {/* Case selector or form */}
        {showCaseSelector ? (
          renderCaseSelector()
        ) : showPreview ? (
          renderPreview()
        ) : (
          <>
            {/* Back to case selector */}
            <button
              onClick={resetToSelector}
              className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#1A1A2E]"
            >
              <ArrowLeft className="h-4 w-4" />
              유형 다시 선택
            </button>

            {/* Selected case badge */}
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-[#1B4D8E]/20 bg-[#1B4D8E]/5 px-4 py-2">
              <span className="text-lg">
                {caseDefinitions.find((c) => c.type === caseType)?.iconEmoji}
              </span>
              <span className="text-sm font-semibold text-[#1B4D8E]">
                {caseDefinitions.find((c) => c.type === caseType)?.label}
              </span>
            </div>

            {/* Step indicator */}
            <div className="mb-8">{renderStepIndicator()}</div>

            {/* Step card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1B4D8E] text-xs font-bold text-white">
                  {currentStep}
                </span>
                <h2 className="text-lg font-semibold text-[#1A1A2E]">
                  {steps[currentStep - 1]?.label}
                </h2>
              </div>

              {renderCurrentStep()}
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => {
                  if (currentStep > 1) setCurrentStep(currentStep - 1);
                }}
                disabled={currentStep === 1}
                className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#1A1A2E] shadow-sm transition-colors hover:bg-[#F7F7F8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </button>

              <div className="flex items-center gap-2">
                {currentStep === totalSteps && (
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#10A37F] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0D8C6D]"
                  >
                    <Eye className="h-4 w-4" />
                    미리보기
                  </button>
                )}

                {currentStep < totalSteps && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#1B4D8E] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#164073]"
                  >
                    다음
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
