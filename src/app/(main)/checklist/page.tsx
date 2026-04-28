'use client';

import { useState } from 'react';
import {
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Info,
  Building2,
  Scale,
  Home,
  FileCheck,
} from 'lucide-react';

/* ─── Step definitions ─── */
const steps = [
  { id: 1, label: '기본정보', icon: Building2 },
  { id: 2, label: '권리관계', icon: Scale },
  { id: 3, label: '시설현황', icon: Home },
  { id: 4, label: '확인사항', icon: FileCheck },
];

/* ─── Form data shape ─── */
interface FormData {
  // Step 1
  address: string;
  area: string;
  buildingType: string;
  buildYear: string;
  // Step 2
  owner: string;
  hasMortgage: boolean;
  mortgageAmount: string;
  hasTenant: boolean;
  // Step 3
  rooms: string;
  bathrooms: string;
  hasParking: boolean;
  parkingSlots: string;
  hasElevator: boolean;
}

const initialData: FormData = {
  address: '서울시 강남구 압구정동 123-45',
  area: '84.9',
  buildingType: '아파트',
  buildYear: '1998',
  owner: '홍길동',
  hasMortgage: false,
  mortgageAmount: '',
  hasTenant: false,
  rooms: '3',
  bathrooms: '2',
  hasParking: true,
  parkingSlots: '1',
  hasElevator: true,
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
export default function ChecklistPage() {
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
        <FormField label="소재지">
          <TextInput
            value={formData.address}
            onChange={(v) => update('address', v)}
            placeholder="주소를 입력하세요"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="면적 (m\u00B2)">
            <TextInput
              value={formData.area}
              onChange={(v) => update('area', v)}
              placeholder="면적"
              type="number"
            />
          </FormField>
          <FormField label="건축연도">
            <TextInput
              value={formData.buildYear}
              onChange={(v) => update('buildYear', v)}
              placeholder="건축연도"
              type="number"
            />
          </FormField>
        </div>

        <FormField label="건물 용도">
          <select
            value={formData.buildingType}
            onChange={(e) => update('buildingType', e.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-[#D1D5DB] bg-white px-3 text-sm text-[#1A1A2E] transition-colors outline-none focus:border-[#1B4D8E] focus:ring-2 focus:ring-[#1B4D8E]/20"
          >
            <option value="아파트">아파트</option>
            <option value="오피스텔">오피스텔</option>
            <option value="다세대">다세대</option>
            <option value="단독주택">단독주택</option>
          </select>
        </FormField>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="grid gap-5">
        <FormField label="소유자">
          <TextInput
            value={formData.owner}
            onChange={(v) => update('owner', v)}
            placeholder="소유자 이름"
          />
        </FormField>

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">저당권 설정 여부</span>
          <Toggle
            checked={formData.hasMortgage}
            onChange={(v) => update('hasMortgage', v)}
          />
        </div>

        {formData.hasMortgage && (
          <FormField label="저당권 금액 (만원)">
            <TextInput
              value={formData.mortgageAmount}
              onChange={(v) => update('mortgageAmount', v)}
              placeholder="금액을 입력하세요"
              type="number"
            />
          </FormField>
        )}

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">임차인 유무</span>
          <Toggle
            checked={formData.hasTenant}
            onChange={(v) => update('hasTenant', v)}
          />
        </div>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="grid gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="방 수">
            <TextInput
              value={formData.rooms}
              onChange={(v) => update('rooms', v)}
              type="number"
            />
          </FormField>
          <FormField label="욕실 수">
            <TextInput
              value={formData.bathrooms}
              onChange={(v) => update('bathrooms', v)}
              type="number"
            />
          </FormField>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">주차 가능</span>
          <Toggle
            checked={formData.hasParking}
            onChange={(v) => update('hasParking', v)}
          />
        </div>

        {formData.hasParking && (
          <FormField label="주차 대수">
            <TextInput
              value={formData.parkingSlots}
              onChange={(v) => update('parkingSlots', v)}
              type="number"
            />
          </FormField>
        )}

        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-4 py-3">
          <span className="text-sm font-medium text-[#1A1A2E]">엘리베이터</span>
          <Toggle
            checked={formData.hasElevator}
            onChange={(v) => update('hasElevator', v)}
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
              본 서비스 오픈 시 사용 가능합니다. 현재는 미리보기만 지원됩니다.
            </p>
          </div>
        </div>

        {/* Disabled sample fields */}
        <div className="grid gap-5 opacity-60">
          <FormField label="하자 사항">
            <TextInput
              value="해당 없음"
              onChange={() => {}}
              disabled
            />
          </FormField>
          <FormField label="벽면 상태">
            <TextInput
              value="양호"
              onChange={() => {}}
              disabled
            />
          </FormField>
          <FormField label="수도/전기 상태">
            <TextInput
              value="정상"
              onChange={() => {}}
              disabled
            />
          </FormField>
          <FormField label="누수 여부">
            <TextInput
              value="없음"
              onChange={() => {}}
              disabled
            />
          </FormField>
          <FormField label="특이사항">
            <TextInput
              value="특이사항 없음"
              onChange={() => {}}
              disabled
            />
          </FormField>
        </div>
      </div>
    );
  }

  /* ─── Preview panel ─── */
  function renderPreview() {
    return (
      <div className="flex flex-col gap-6">
        {/* Official-looking document */}
        <div className="rounded-2xl border-2 border-[#1B4D8E]/30 bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="mb-6 border-b-2 border-[#1B4D8E] pb-4 text-center">
            <p className="text-xs tracking-widest text-[#6B7280]">부동산거래 서식</p>
            <h2 className="mt-1 text-xl font-bold text-[#1A1A2E] sm:text-2xl">
              중개대상물 확인 \u00B7 설명서
            </h2>
            <p className="mt-1 text-xs text-[#6B7280]">
              [제 &nbsp;2024-0327 &nbsp;호]
            </p>
          </div>

          {/* Section: 기본정보 */}
          <div className="mb-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">
                1
              </span>
              기본정보
            </h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-medium text-[#6B7280]">소재지</span>
              <span className="text-[#1A1A2E]">{formData.address}</span>
              <span className="font-medium text-[#6B7280]">면적</span>
              <span className="text-[#1A1A2E]">{formData.area} m&sup2;</span>
              <span className="font-medium text-[#6B7280]">건물 용도</span>
              <span className="text-[#1A1A2E]">{formData.buildingType}</span>
              <span className="font-medium text-[#6B7280]">건축연도</span>
              <span className="text-[#1A1A2E]">{formData.buildYear}년</span>
            </div>
          </div>

          <hr className="my-4 border-dashed" />

          {/* Section: 권리관계 */}
          <div className="mb-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">
                2
              </span>
              권리관계
            </h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-medium text-[#6B7280]">소유자</span>
              <span className="text-[#1A1A2E]">{formData.owner}</span>
              <span className="font-medium text-[#6B7280]">저당권</span>
              <span className="text-[#1A1A2E]">
                {formData.hasMortgage
                  ? `설정 (${Number(formData.mortgageAmount).toLocaleString()}만원)`
                  : '미설정'}
              </span>
              <span className="font-medium text-[#6B7280]">임차인</span>
              <span className="text-[#1A1A2E]">
                {formData.hasTenant ? '있음' : '없음'}
              </span>
            </div>
          </div>

          <hr className="my-4 border-dashed" />

          {/* Section: 시설현황 */}
          <div className="mb-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">
                3
              </span>
              시설현황
            </h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="font-medium text-[#6B7280]">방 수</span>
              <span className="text-[#1A1A2E]">{formData.rooms}개</span>
              <span className="font-medium text-[#6B7280]">욕실 수</span>
              <span className="text-[#1A1A2E]">{formData.bathrooms}개</span>
              <span className="font-medium text-[#6B7280]">주차</span>
              <span className="text-[#1A1A2E]">
                {formData.hasParking
                  ? `가능 (${formData.parkingSlots}대)`
                  : '불가'}
              </span>
              <span className="font-medium text-[#6B7280]">엘리베이터</span>
              <span className="text-[#1A1A2E]">
                {formData.hasElevator ? '있음' : '없음'}
              </span>
            </div>
          </div>

          <hr className="my-4 border-dashed" />

          {/* Section: 확인사항 */}
          <div className="mb-2">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1B4D8E]">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1B4D8E] text-[10px] font-bold text-white">
                4
              </span>
              확인사항
            </h3>
            <p className="text-sm italic text-[#9CA3AF]">
              서비스 오픈 시 확인사항이 표시됩니다.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t-2 border-[#1B4D8E] pt-4 text-center">
            <p className="text-xs text-[#6B7280]">
              위 내용은 중개대상물의 현황에 대하여 성실하고 정확하게 작성하였음을 확인합니다.
            </p>
            <div className="mt-4 flex items-center justify-center gap-8 text-sm text-[#1A1A2E]">
              <div className="text-center">
                <p className="text-xs text-[#6B7280]">작성일</p>
                <p className="mt-1 font-medium">2026년 03월 27일</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#6B7280]">개업공인중개사</p>
                <p className="mt-1 font-medium">강남부동산 (인)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back button */}
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
              {/* Circle */}
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

              {/* Connector line */}
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
            <ClipboardList className="h-6 w-6 text-[#1B4D8E]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">
            중개대상물 확인서 도우미
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            단계별로 정보를 입력하면 중개대상물 확인서 견본을 미리 확인할 수 있습니다.
          </p>
        </div>

        {/* Step indicator */}
        {!showPreview && <div className="mb-8">{renderStepIndicator()}</div>}

        {/* Content */}
        {showPreview ? (
          renderPreview()
        ) : (
          <>
            {/* Step card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
              {/* Step title */}
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1B4D8E] text-xs font-bold text-white">
                  {currentStep}
                </span>
                <h2 className="text-lg font-semibold text-[#1A1A2E]">
                  {steps[currentStep - 1].label}
                </h2>
              </div>

              {/* Step content */}
              {stepRenderers[currentStep]()}
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
                {currentStep === 4 && (
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#10A37F] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0D8C6D]"
                  >
                    <Eye className="h-4 w-4" />
                    미리보기
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
