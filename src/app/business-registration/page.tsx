'use client';

import { useState } from 'react';
import {
  Store,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Info,
  User,
  Building2,
  Warehouse,
  FileCheck,
} from 'lucide-react';

/* ─── Step definitions ─── */
const steps = [
  { id: 1, label: '사업자 정보', icon: User },
  { id: 2, label: '사업장 정보', icon: Building2 },
  { id: 3, label: '시설 정보', icon: Warehouse },
  { id: 4, label: '확인 및 미리보기', icon: FileCheck },
];

/* ─── Form data shape ─── */
interface FormData {
  // Step 1 - 사업자 정보
  businessTitle: string;
  ownerName: string;
  ownerRrn: string;
  ownerPhone: string;
  ownerAddress: string;
  // Step 2 - 사업장 정보
  shopAddress: string;
  shopDetailAddress: string;
  businessCategory: string;
  businessSubCategory: string;
  openDate: string;
  hasLicense: boolean;
  // Step 3 - 시설 정보
  totalArea: string;
  officeArea: string;
  hasFireEquipment: boolean;
  hasCctv: boolean;
  hasParking: boolean;
  parkingCount: string;
  additionalFacilities: string;
}

const initialData: FormData = {
  businessTitle: '강남공인중개사사무소',
  ownerName: '홍길동',
  ownerRrn: '800101-1******',
  ownerPhone: '010-9876-5432',
  ownerAddress: '서울시 강남구 삼성동 45-67',
  shopAddress: '서울시 강남구 테헤란로 456',
  shopDetailAddress: '1층 101호',
  businessCategory: '부동산업',
  businessSubCategory: '부동산 중개업',
  openDate: '2026-04-01',
  hasLicense: true,
  totalArea: '66',
  officeArea: '33',
  hasFireEquipment: true,
  hasCctv: true,
  hasParking: true,
  parkingCount: '2',
  additionalFacilities: '고객 대기실, 상담실',
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
export default function BusinessRegistrationPage() {
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
        <FormField label="상호명">
          <TextInput
            value={formData.businessTitle}
            onChange={(v) => update('businessTitle', v)}
            placeholder="상호명을 입력하세요"
          />
        </FormField>

        <FormField label="대표자명">
          <TextInput
            value={formData.ownerName}
            onChange={(v) => update('ownerName', v)}
            placeholder="대표자 성명"
          />
        </FormField>

        <FormField label="주민등록번호">
          <TextInput
            value={formData.ownerRrn}
            onChange={(v) => update('ownerRrn', v)}
            placeholder="000000-0000000"
          />
        </FormField>

        <FormField label="연락처">
          <TextInput
            value={formData.ownerPhone}
            onChange={(v) => update('ownerPhone', v)}
            placeholder="010-0000-0000"
          />
        </FormField>

        <FormField label="대표자 주소">
          <TextInput
            value={formData.ownerAddress}
            onChange={(v) => update('ownerAddress', v)}
            placeholder="주소를 입력하세요"
          />
        </FormField>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="grid gap-5">
        <FormField label="사업장 주소">
          <TextInput
            value={formData.shopAddress}
            onChange={(v) => update('shopAddress', v)}
            placeholder="사업장 주소"
          />
        </FormField>

        <FormField label="상세 주소">
          <TextInput
            value={formData.shopDetailAddress}
            onChange={(v) => update('shopDetailAddress', v)}
            placeholder="층, 호수 등"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="업종(대분류)">
            <select
              value={formData.businessCategory}
              onChange={(e) => update('businessCategory', e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1A2E] transition-colors outline-none focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20"
            >
              <option value="부동산업">부동산업</option>
              <option value="도소매업">도소매업</option>
              <option value="음식점업">음식점업</option>
              <option value="서비스업">서비스업</option>
              <option value="제조업">제조업</option>
              <option value="건설업">건설업</option>
              <option value="교육서비스업">교육서비스업</option>
              <option value="기타">기타</option>
            </select>
          </FormField>

          <FormField label="업태(세분류)">
            <TextInput
              value={formData.businessSubCategory}
              onChange={(v) => update('businessSubCategory', v)}
              placeholder="세부 업종"
            />
          </FormField>
        </div>

        <FormField label="개업 예정일">
          <TextInput
            value={formData.openDate}
            onChange={(v) => update('openDate', v)}
            type="date"
          />
        </FormField>

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">사업 인허가 보유</span>
          <Toggle
            checked={formData.hasLicense}
            onChange={(v) => update('hasLicense', v)}
          />
        </div>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="grid gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="총 면적 (m²)">
            <TextInput
              value={formData.totalArea}
              onChange={(v) => update('totalArea', v)}
              placeholder="총 면적"
              type="number"
            />
          </FormField>
          <FormField label="사무실 면적 (m²)">
            <TextInput
              value={formData.officeArea}
              onChange={(v) => update('officeArea', v)}
              placeholder="사무실 면적"
              type="number"
            />
          </FormField>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">소방설비 구비</span>
          <Toggle
            checked={formData.hasFireEquipment}
            onChange={(v) => update('hasFireEquipment', v)}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">CCTV 설치</span>
          <Toggle
            checked={formData.hasCctv}
            onChange={(v) => update('hasCctv', v)}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">주차 가능</span>
          <Toggle
            checked={formData.hasParking}
            onChange={(v) => update('hasParking', v)}
          />
        </div>

        {formData.hasParking && (
          <FormField label="주차 가능 대수">
            <TextInput
              value={formData.parkingCount}
              onChange={(v) => update('parkingCount', v)}
              type="number"
            />
          </FormField>
        )}

        <FormField label="추가 시설/설비">
          <TextInput
            value={formData.additionalFacilities}
            onChange={(v) => update('additionalFacilities', v)}
            placeholder="추가 시설을 입력하세요"
          />
        </FormField>
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
              입력하신 정보를 확인해주세요. 견본 미리보기 버튼을 눌러 개설 등록 신청서 양식을 확인할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1B4D8E]">사업자 정보</h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <span className="text-[#6B7280]">상호명</span>
              <span className="text-[#1A1A2E]">{formData.businessTitle}</span>
              <span className="text-[#6B7280]">대표자명</span>
              <span className="text-[#1A1A2E]">{formData.ownerName}</span>
              <span className="text-[#6B7280]">연락처</span>
              <span className="text-[#1A1A2E]">{formData.ownerPhone}</span>
              <span className="text-[#6B7280]">주소</span>
              <span className="text-[#1A1A2E]">{formData.ownerAddress}</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1B4D8E]">사업장 정보</h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <span className="text-[#6B7280]">주소</span>
              <span className="text-[#1A1A2E]">{formData.shopAddress} {formData.shopDetailAddress}</span>
              <span className="text-[#6B7280]">업종</span>
              <span className="text-[#1A1A2E]">{formData.businessCategory} / {formData.businessSubCategory}</span>
              <span className="text-[#6B7280]">개업 예정일</span>
              <span className="text-[#1A1A2E]">{formData.openDate}</span>
              <span className="text-[#6B7280]">인허가</span>
              <span className="text-[#1A1A2E]">{formData.hasLicense ? '보유' : '미보유'}</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1B4D8E]">시설 정보</h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <span className="text-[#6B7280]">총 면적</span>
              <span className="text-[#1A1A2E]">{formData.totalArea}m²</span>
              <span className="text-[#6B7280]">사무실 면적</span>
              <span className="text-[#1A1A2E]">{formData.officeArea}m²</span>
              <span className="text-[#6B7280]">소방설비</span>
              <span className="text-[#1A1A2E]">{formData.hasFireEquipment ? '구비' : '미구비'}</span>
              <span className="text-[#6B7280]">CCTV</span>
              <span className="text-[#1A1A2E]">{formData.hasCctv ? '설치' : '미설치'}</span>
              <span className="text-[#6B7280]">주차</span>
              <span className="text-[#1A1A2E]">{formData.hasParking ? `가능 (${formData.parkingCount}대)` : '불가'}</span>
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
            <p className="text-xs tracking-widest text-[#6B7280]">강남구청 서식</p>
            <h2 className="mt-1 text-xl font-bold text-[#1A1A2E] sm:text-2xl">
              중개사무소 개설 등록 신청서
            </h2>
            <p className="mt-1 text-xs text-[#6B7280]">
              [공인중개사법 시행규칙 별지 제1호 서식]
            </p>
          </div>

          {/* Section: 사업자 정보 */}
          <div className="mb-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">1</span>
              신청인(대표자) 정보
            </h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-medium text-[#6B7280]">상호명</span>
              <span className="text-[#1A1A2E]">{formData.businessTitle}</span>
              <span className="font-medium text-[#6B7280]">대표자</span>
              <span className="text-[#1A1A2E]">{formData.ownerName}</span>
              <span className="font-medium text-[#6B7280]">주민등록번호</span>
              <span className="text-[#1A1A2E]">{formData.ownerRrn}</span>
              <span className="font-medium text-[#6B7280]">연락처</span>
              <span className="text-[#1A1A2E]">{formData.ownerPhone}</span>
              <span className="font-medium text-[#6B7280]">주소</span>
              <span className="text-[#1A1A2E]">{formData.ownerAddress}</span>
            </div>
          </div>

          <hr className="my-4 border-dashed" />

          {/* Section: 사업장 정보 */}
          <div className="mb-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">2</span>
              사무소 정보
            </h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-medium text-[#6B7280]">소재지</span>
              <span className="text-[#1A1A2E]">{formData.shopAddress} {formData.shopDetailAddress}</span>
              <span className="font-medium text-[#6B7280]">업종</span>
              <span className="text-[#1A1A2E]">{formData.businessCategory} / {formData.businessSubCategory}</span>
              <span className="font-medium text-[#6B7280]">개업 예정일</span>
              <span className="text-[#1A1A2E]">{formData.openDate}</span>
              <span className="font-medium text-[#6B7280]">인허가</span>
              <span className="text-[#1A1A2E]">{formData.hasLicense ? '보유' : '미보유'}</span>
            </div>
          </div>

          <hr className="my-4 border-dashed" />

          {/* Section: 시설 정보 */}
          <div className="mb-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">3</span>
              시설 현황
            </h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-medium text-[#6B7280]">총 면적</span>
              <span className="text-[#1A1A2E]">{formData.totalArea}m²</span>
              <span className="font-medium text-[#6B7280]">사무실 면적</span>
              <span className="text-[#1A1A2E]">{formData.officeArea}m²</span>
              <span className="font-medium text-[#6B7280]">소방설비</span>
              <span className="text-[#1A1A2E]">{formData.hasFireEquipment ? '구비' : '미구비'}</span>
              <span className="font-medium text-[#6B7280]">CCTV</span>
              <span className="text-[#1A1A2E]">{formData.hasCctv ? '설치' : '미설치'}</span>
              <span className="font-medium text-[#6B7280]">주차</span>
              <span className="text-[#1A1A2E]">{formData.hasParking ? `가능 (${formData.parkingCount}대)` : '불가'}</span>
              <span className="font-medium text-[#6B7280]">추가 시설</span>
              <span className="text-[#1A1A2E]">{formData.additionalFacilities || '없음'}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t-2 border-[#1B4D8E] pt-4 text-center">
            <p className="text-xs text-[#6B7280]">
              위와 같이 중개사무소 개설 등록을 신청합니다.
            </p>
            <div className="mt-4 flex items-center justify-center gap-8 text-sm text-[#1A1A2E]">
              <div className="text-center">
                <p className="text-xs text-[#6B7280]">신청일</p>
                <p className="mt-1 font-medium">2026년 04월 07일</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#6B7280]">신청인</p>
                <p className="mt-1 font-medium">{formData.ownerName} (인)</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[#6B7280]">강남구청장 귀하</p>
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
            <Store className="h-6 w-6 text-[#1B4D8E]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">
            개설 등록 도우미
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            단계별로 정보를 입력하면 중개사무소 개설 등록 신청서 견본을 미리 확인할 수 있습니다.
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
