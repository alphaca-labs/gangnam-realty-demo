'use client';

import { useState } from 'react';
import {
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Info,
  User,
  Building2,
  Briefcase,
  FileCheck,
} from 'lucide-react';

/* ─── Step definitions ─── */
const steps = [
  { id: 1, label: '근로자 정보', icon: User },
  { id: 2, label: '사업장 정보', icon: Building2 },
  { id: 3, label: '고용 정보', icon: Briefcase },
  { id: 4, label: '확인 및 미리보기', icon: FileCheck },
];

/* ─── Form data shape ─── */
interface FormData {
  // Step 1 - 근로자 정보
  workerName: string;
  workerRrn: string;
  workerPhone: string;
  workerAddress: string;
  workerNationality: string;
  // Step 2 - 사업장 정보
  businessNumber: string;
  businessName: string;
  businessOwner: string;
  businessAddress: string;
  businessType: string;
  // Step 3 - 고용 정보
  hireDate: string;
  jobType: string;
  contractType: string;
  salary: string;
  salaryType: string;
  workHours: string;
  hasSocialInsurance: boolean;
}

const initialData: FormData = {
  workerName: '김민수',
  workerRrn: '900101-1******',
  workerPhone: '010-1234-5678',
  workerAddress: '서울시 강남구 역삼동 123-45',
  workerNationality: '대한민국',
  businessNumber: '123-45-67890',
  businessName: '강남부동산중개법인',
  businessOwner: '홍길동',
  businessAddress: '서울시 강남구 테헤란로 123',
  businessType: '부동산업',
  hireDate: '2026-04-01',
  jobType: '사무직',
  contractType: '정규직',
  salary: '3000',
  salaryType: '월급',
  workHours: '주 40시간',
  hasSocialInsurance: true,
};

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

/* ─── Main page ─── */
export default function EmploymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [showPreview, setShowPreview] = useState(false);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  /* ─── Step content renderers ─── */
  function renderStep1() {
    return (
      <div className="grid gap-5">
        <FormField label="성명">
          <TextInput
            value={formData.workerName}
            onChange={(v) => update('workerName', v)}
            placeholder="근로자 성명"
          />
        </FormField>

        <FormField label="주민등록번호">
          <TextInput
            value={formData.workerRrn}
            onChange={(v) => update('workerRrn', v)}
            placeholder="000000-0000000"
          />
        </FormField>

        <FormField label="연락처">
          <TextInput
            value={formData.workerPhone}
            onChange={(v) => update('workerPhone', v)}
            placeholder="010-0000-0000"
          />
        </FormField>

        <FormField label="주소">
          <TextInput
            value={formData.workerAddress}
            onChange={(v) => update('workerAddress', v)}
            placeholder="주소를 입력하세요"
          />
        </FormField>

        <FormField label="국적">
          <select
            value={formData.workerNationality}
            onChange={(e) => update('workerNationality', e.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1A2E] transition-colors outline-none focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20"
          >
            <option value="대한민국">대한민국</option>
            <option value="중국">중국</option>
            <option value="베트남">베트남</option>
            <option value="기타">기타</option>
          </select>
        </FormField>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="grid gap-5">
        <FormField label="사업자등록번호">
          <TextInput
            value={formData.businessNumber}
            onChange={(v) => update('businessNumber', v)}
            placeholder="000-00-00000"
          />
        </FormField>

        <FormField label="사업장명(상호)">
          <TextInput
            value={formData.businessName}
            onChange={(v) => update('businessName', v)}
            placeholder="사업장명을 입력하세요"
          />
        </FormField>

        <FormField label="대표자명">
          <TextInput
            value={formData.businessOwner}
            onChange={(v) => update('businessOwner', v)}
            placeholder="대표자명"
          />
        </FormField>

        <FormField label="사업장 소재지">
          <TextInput
            value={formData.businessAddress}
            onChange={(v) => update('businessAddress', v)}
            placeholder="사업장 주소"
          />
        </FormField>

        <FormField label="업종">
          <select
            value={formData.businessType}
            onChange={(e) => update('businessType', e.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1A2E] transition-colors outline-none focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20"
          >
            <option value="부동산업">부동산업</option>
            <option value="도소매업">도소매업</option>
            <option value="음식점업">음식점업</option>
            <option value="서비스업">서비스업</option>
            <option value="제조업">제조업</option>
            <option value="건설업">건설업</option>
            <option value="기타">기타</option>
          </select>
        </FormField>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="grid gap-5">
        <FormField label="입사일">
          <TextInput
            value={formData.hireDate}
            onChange={(v) => update('hireDate', v)}
            type="date"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="직종">
            <select
              value={formData.jobType}
              onChange={(e) => update('jobType', e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1A2E] transition-colors outline-none focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20"
            >
              <option value="사무직">사무직</option>
              <option value="영업직">영업직</option>
              <option value="기술직">기술직</option>
              <option value="서비스직">서비스직</option>
              <option value="생산직">생산직</option>
              <option value="기타">기타</option>
            </select>
          </FormField>

          <FormField label="계약 형태">
            <select
              value={formData.contractType}
              onChange={(e) => update('contractType', e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1A2E] transition-colors outline-none focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20"
            >
              <option value="정규직">정규직</option>
              <option value="계약직">계약직</option>
              <option value="일용직">일용직</option>
              <option value="파트타임">파트타임</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="급여 (만원)">
            <TextInput
              value={formData.salary}
              onChange={(v) => update('salary', v)}
              placeholder="급여액"
              type="number"
            />
          </FormField>

          <FormField label="급여 유형">
            <select
              value={formData.salaryType}
              onChange={(e) => update('salaryType', e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1A2E] transition-colors outline-none focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20"
            >
              <option value="월급">월급</option>
              <option value="일급">일급</option>
              <option value="시급">시급</option>
              <option value="연봉">연봉</option>
            </select>
          </FormField>
        </div>

        <FormField label="근무시간">
          <select
            value={formData.workHours}
            onChange={(e) => update('workHours', e.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1A2E] transition-colors outline-none focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20"
          >
            <option value="주 40시간">주 40시간 (전일제)</option>
            <option value="주 30시간">주 30시간</option>
            <option value="주 20시간">주 20시간 (단시간)</option>
            <option value="주 15시간 미만">주 15시간 미만</option>
          </select>
        </FormField>

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">4대 보험 가입</span>
          <Toggle
            checked={formData.hasSocialInsurance}
            onChange={(v) => update('hasSocialInsurance', v)}
          />
        </div>
      </div>
    );
  }

  function renderStep4() {
    return (
      <div className="grid gap-5">
        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl border border-[#1B4D8E]/20 bg-[#E3F2FD] px-4 py-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#1B4D8E]" />
          <div>
            <p className="text-sm font-medium text-[#1B4D8E]">안내</p>
            <p className="text-sm text-[#1B4D8E]/80">
              입력하신 정보를 확인해주세요. 견본 미리보기 버튼을 눌러 고용신고서 양식을 확인할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1B4D8E]">근로자 정보</h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <span className="text-[#6B7280]">성명</span>
              <span className="text-[#1A1A2E]">{formData.workerName}</span>
              <span className="text-[#6B7280]">주민등록번호</span>
              <span className="text-[#1A1A2E]">{formData.workerRrn}</span>
              <span className="text-[#6B7280]">연락처</span>
              <span className="text-[#1A1A2E]">{formData.workerPhone}</span>
              <span className="text-[#6B7280]">주소</span>
              <span className="text-[#1A1A2E]">{formData.workerAddress}</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1B4D8E]">사업장 정보</h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <span className="text-[#6B7280]">사업자등록번호</span>
              <span className="text-[#1A1A2E]">{formData.businessNumber}</span>
              <span className="text-[#6B7280]">사업장명</span>
              <span className="text-[#1A1A2E]">{formData.businessName}</span>
              <span className="text-[#6B7280]">대표자</span>
              <span className="text-[#1A1A2E]">{formData.businessOwner}</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1B4D8E]">고용 정보</h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <span className="text-[#6B7280]">입사일</span>
              <span className="text-[#1A1A2E]">{formData.hireDate}</span>
              <span className="text-[#6B7280]">직종</span>
              <span className="text-[#1A1A2E]">{formData.jobType} ({formData.contractType})</span>
              <span className="text-[#6B7280]">급여</span>
              <span className="text-[#1A1A2E]">{Number(formData.salary).toLocaleString()}만원 ({formData.salaryType})</span>
              <span className="text-[#6B7280]">4대 보험</span>
              <span className="text-[#1A1A2E]">{formData.hasSocialInsurance ? '가입' : '미가입'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Preview panel ─── */
  function renderPreview() {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border-2 border-[#1B4D8E]/30 bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="mb-6 border-b-2 border-[#1B4D8E] pb-4 text-center">
            <p className="text-xs tracking-widest text-[#6B7280]">고용노동부 서식</p>
            <h2 className="mt-1 text-xl font-bold text-[#1A1A2E] sm:text-2xl">
              고용신고서
            </h2>
            <p className="mt-1 text-xs text-[#6B7280]">
              [근로기준법 시행규칙 별지 서식]
            </p>
          </div>

          {/* Section: 근로자 정보 */}
          <div className="mb-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">1</span>
              근로자 인적사항
            </h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-medium text-[#6B7280]">성명</span>
              <span className="text-[#1A1A2E]">{formData.workerName}</span>
              <span className="font-medium text-[#6B7280]">주민등록번호</span>
              <span className="text-[#1A1A2E]">{formData.workerRrn}</span>
              <span className="font-medium text-[#6B7280]">연락처</span>
              <span className="text-[#1A1A2E]">{formData.workerPhone}</span>
              <span className="font-medium text-[#6B7280]">주소</span>
              <span className="text-[#1A1A2E]">{formData.workerAddress}</span>
              <span className="font-medium text-[#6B7280]">국적</span>
              <span className="text-[#1A1A2E]">{formData.workerNationality}</span>
            </div>
          </div>

          <hr className="my-4 border-dashed" />

          {/* Section: 사업장 정보 */}
          <div className="mb-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">2</span>
              사업장 정보
            </h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-medium text-[#6B7280]">사업자등록번호</span>
              <span className="text-[#1A1A2E]">{formData.businessNumber}</span>
              <span className="font-medium text-[#6B7280]">사업장명</span>
              <span className="text-[#1A1A2E]">{formData.businessName}</span>
              <span className="font-medium text-[#6B7280]">대표자</span>
              <span className="text-[#1A1A2E]">{formData.businessOwner}</span>
              <span className="font-medium text-[#6B7280]">소재지</span>
              <span className="text-[#1A1A2E]">{formData.businessAddress}</span>
              <span className="font-medium text-[#6B7280]">업종</span>
              <span className="text-[#1A1A2E]">{formData.businessType}</span>
            </div>
          </div>

          <hr className="my-4 border-dashed" />

          {/* Section: 고용 정보 */}
          <div className="mb-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">3</span>
              고용 내역
            </h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-medium text-[#6B7280]">입사일</span>
              <span className="text-[#1A1A2E]">{formData.hireDate}</span>
              <span className="font-medium text-[#6B7280]">직종</span>
              <span className="text-[#1A1A2E]">{formData.jobType}</span>
              <span className="font-medium text-[#6B7280]">계약 형태</span>
              <span className="text-[#1A1A2E]">{formData.contractType}</span>
              <span className="font-medium text-[#6B7280]">급여</span>
              <span className="text-[#1A1A2E]">{Number(formData.salary).toLocaleString()}만원 ({formData.salaryType})</span>
              <span className="font-medium text-[#6B7280]">근무시간</span>
              <span className="text-[#1A1A2E]">{formData.workHours}</span>
              <span className="font-medium text-[#6B7280]">4대 보험</span>
              <span className="text-[#1A1A2E]">{formData.hasSocialInsurance ? '가입' : '미가입'}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t-2 border-[#1B4D8E] pt-4 text-center">
            <p className="text-xs text-[#6B7280]">
              위와 같이 근로자를 고용하였음을 신고합니다.
            </p>
            <div className="mt-4 flex items-center justify-center gap-8 text-sm text-[#1A1A2E]">
              <div className="text-center">
                <p className="text-xs text-[#6B7280]">신고일</p>
                <p className="mt-1 font-medium">2026년 04월 07일</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#6B7280]">사업주</p>
                <p className="mt-1 font-medium">{formData.businessOwner} (인)</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPreview(false)}
          className="mx-auto flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#1A1A2E] shadow-sm transition-colors hover:bg-[#F7F7F8]"
        >
          <ChevronLeft className="h-4 w-4" />
          돌아가기
        </button>
      </div>
    );
  }

  /* ─── Step indicator ─── */
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
                  className={`mx-1 mb-5 h-0.5 w-8 sm:w-12 md:w-16 ${
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

  /* ─── Main render ─── */
  const stepRenderers: Record<number, () => React.ReactNode> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto pt-14 lg:pt-0">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E3F2FD]">
            <UserPlus className="h-6 w-6 text-[#1B4D8E]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">
            고용신고 도우미
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            단계별로 정보를 입력하면 고용신고서 견본을 미리 확인할 수 있습니다.
          </p>
        </div>

        {/* Step indicator */}
        {!showPreview && <div className="mb-8">{renderStepIndicator()}</div>}

        {/* Content */}
        {showPreview ? (
          renderPreview()
        ) : (
          <>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1B4D8E] text-xs font-bold text-white">
                  {currentStep}
                </span>
                <h2 className="text-lg font-semibold text-[#1A1A2E]">
                  {steps[currentStep - 1].label}
                </h2>
              </div>

              {stepRenderers[currentStep]()}
            </div>

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
                {currentStep === 4 && (
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#10A37F] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0D8C6D]"
                  >
                    <Eye className="h-4 w-4" />
                    견본 미리보기
                  </button>
                )}

                {currentStep < 4 && (
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
