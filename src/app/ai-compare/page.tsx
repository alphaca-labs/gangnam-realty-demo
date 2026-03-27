'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Bot,
  CheckSquare,
  Square,
  AlertTriangle,
  Shield,
  FileSearch,
  Home,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Scenario data
// ---------------------------------------------------------------------------

interface Scenario {
  id: number;
  question: string;
  oldResponse: string;
  newResponse: React.ReactNode;
}

// Scenario 3 needs interactive checklist state, handled in component

const DONG_PRICES = [
  { name: '압구정동', price: 32, max: 45 },
  { name: '청담동', price: 28, max: 45 },
  { name: '삼성동', price: 26, max: 45 },
  { name: '대치동', price: 24, max: 45 },
  { name: '역삼동', price: 21, max: 45 },
  { name: '논현동', price: 19, max: 45 },
];

const RATE_TABLE = [
  { range: '5천만 이하', rate: '0.5%', limit: '25만원' },
  { range: '5천만~2억', rate: '0.4%', limit: '80만원' },
  { range: '2억~9억', rate: '0.5%', limit: '없음' },
  { range: '9억~12억', rate: '0.6%', limit: '없음' },
  { range: '12억~15억', rate: '0.7%', limit: '없음' },
];

const CHECKLIST_ITEMS = [
  { id: 1, text: '등기부등본 확인 (갑구: 소유권, 을구: 근저당)' },
  { id: 2, text: '전입신고 및 확정일자 받기 (이사 당일)' },
  { id: 3, text: '전세보증보험 가입 (HUG, SGI 등)' },
  { id: 4, text: '임대인 세금 체납 여부 확인 (국세·지방세)' },
  { id: 5, text: '건축물대장 확인 (위반건축물 여부)' },
  { id: 6, text: '전세가율 확인 (매매가 대비 70% 이하 권장)' },
];

// ---------------------------------------------------------------------------
// Rich response sub-components
// ---------------------------------------------------------------------------

function Scenario1Rich() {
  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-[#1A1A2E]">
        강남구 주요 동별 아파트 시세를 정리해드렸습니다.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#E3F2FD] px-3 py-2.5">
          <p className="text-xs text-[#6B7280]">평균가</p>
          <p className="text-lg font-bold text-[#1B4D8E]">25.0억</p>
        </div>
        <div className="rounded-xl bg-[#E3F2FD] px-3 py-2.5">
          <p className="text-xs text-[#6B7280]">최고가</p>
          <p className="text-lg font-bold text-[#1B4D8E]">45.2억</p>
        </div>
        <div className="rounded-xl bg-[#E3F2FD] px-3 py-2.5">
          <p className="text-xs text-[#6B7280]">최저가</p>
          <p className="text-lg font-bold text-[#1B4D8E]">12.8억</p>
        </div>
        <div className="rounded-xl bg-[#D1FAE5] px-3 py-2.5">
          <p className="text-xs text-[#6B7280]">거래건수</p>
          <p className="text-lg font-bold text-[#10A37F]">847건</p>
        </div>
      </div>

      {/* CSS bar chart */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          동별 평균 시세 (억원)
        </h4>
        <div className="space-y-2.5">
          {DONG_PRICES.map((dong) => (
            <div key={dong.name} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-xs font-medium text-[#6B7280]">
                {dong.name}
              </span>
              <div className="flex-1">
                <div className="h-5 rounded-md bg-[#F7F7F8] overflow-hidden">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-[#1B4D8E] to-[#3B82F6] transition-all duration-500"
                    style={{ width: `${(dong.price / dong.max) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-10 shrink-0 text-right text-xs font-semibold text-[#1A1A2E]">
                {dong.price}억
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#6B7280]">
          * 2025년 1분기 기준, 3.3m² 당 평균 매매가
        </p>
      </div>
    </div>
  );
}

function Scenario2Rich() {
  const [inputAmount, setInputAmount] = useState('900000000');
  const amount = parseInt(inputAmount.replace(/[^0-9]/g, '')) || 0;

  function getRate(val: number): { rate: number; bracket: string } {
    if (val <= 50000000) return { rate: 0.5, bracket: '5천만 이하' };
    if (val <= 200000000) return { rate: 0.4, bracket: '5천만~2억' };
    if (val <= 900000000) return { rate: 0.5, bracket: '2억~9억' };
    if (val <= 1200000000) return { rate: 0.6, bracket: '9억~12억' };
    return { rate: 0.7, bracket: '12억~15억' };
  }

  const { rate, bracket } = getRate(amount);
  const commission = Math.round(amount * (rate / 100));
  const vat = Math.round(commission * 0.1);
  const total = commission + vat;

  function formatWon(v: number): string {
    if (v >= 100000000) {
      const eok = Math.floor(v / 100000000);
      const man = Math.floor((v % 100000000) / 10000);
      return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
    }
    if (v >= 10000) return `${Math.floor(v / 10000).toLocaleString()}만원`;
    return `${v.toLocaleString()}원`;
  }

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-[#1A1A2E]">
        매매 금액에 따른 중개수수료를 바로 계산해드릴게요.
      </p>

      {/* Calculator card */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          수수료 간편 계산기
        </h4>

        {/* Input */}
        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-[#6B7280]">
            매매금액
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={amount > 0 ? amount.toLocaleString('ko-KR') : ''}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="금액을 입력하세요"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-3 py-2 pr-8 text-sm outline-none transition-colors focus:border-[#1B4D8E] focus:bg-white focus:ring-1 focus:ring-[#1B4D8E]/20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B7280]">
              원
            </span>
          </div>
          {amount > 0 && (
            <p className="mt-1 text-xs font-medium text-[#1B4D8E]">
              = {formatWon(amount)}
            </p>
          )}
        </div>

        {/* Quick amounts */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {[
            { label: '3억', val: 300000000 },
            { label: '6억', val: 600000000 },
            { label: '9억', val: 900000000 },
            { label: '12억', val: 1200000000 },
          ].map((q) => (
            <button
              key={q.val}
              onClick={() => setInputAmount(String(q.val))}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                amount === q.val
                  ? 'bg-[#1B4D8E] text-white'
                  : 'bg-[#F7F7F8] text-[#6B7280] hover:bg-[#ECECF1]'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Result */}
        {amount > 0 && (
          <div className="rounded-lg bg-[#F7F7F8] p-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#6B7280]">적용 요율</span>
              <span className="font-medium text-[#1A1A2E]">
                {rate}% ({bracket})
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6B7280]">중개수수료</span>
              <span className="font-medium text-[#1A1A2E]">{formatWon(commission)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6B7280]">부가세 (10%)</span>
              <span className="font-medium text-[#1A1A2E]">{formatWon(vat)}</span>
            </div>
            <div className="border-t border-[#E5E7EB] pt-1.5 flex justify-between">
              <span className="text-sm font-semibold text-[#1A1A2E]">총 비용</span>
              <span className="text-sm font-bold text-[#10A37F]">{formatWon(total)}</span>
            </div>
          </div>
        )}

        {/* Rate table */}
        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-medium text-[#1B4D8E] hover:underline">
            요율표 보기
          </summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="pb-1.5 text-left font-medium text-[#6B7280]">거래금액</th>
                  <th className="pb-1.5 text-right font-medium text-[#6B7280]">요율</th>
                  <th className="pb-1.5 text-right font-medium text-[#6B7280]">한도</th>
                </tr>
              </thead>
              <tbody>
                {RATE_TABLE.map((row) => (
                  <tr
                    key={row.range}
                    className={`border-b border-[#E5E7EB]/50 last:border-0 ${
                      bracket === row.range ? 'bg-[#E3F2FD]/50 font-medium' : ''
                    }`}
                  >
                    <td className="py-1.5 text-[#1A1A2E]">{row.range}</td>
                    <td className="py-1.5 text-right text-[#1A1A2E]">{row.rate}</td>
                    <td className="py-1.5 text-right text-[#1A1A2E]">{row.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}

function Scenario3Rich() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  function toggle(id: number) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-[#1A1A2E]">
        전세 계약 시 반드시 확인해야 할 사항을 체크리스트로 정리했습니다.
      </p>

      {/* Warning banner */}
      <div className="flex items-start gap-2.5 rounded-xl bg-[#FEF3C7] px-3.5 py-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
        <div>
          <p className="text-sm font-semibold text-[#92400E]">전세사기 주의</p>
          <p className="mt-0.5 text-xs text-[#92400E]/80">
            2024년 전세사기 피해는 전년 대비 15% 증가했습니다. 아래 항목을 반드시 확인하세요.
          </p>
        </div>
      </div>

      {/* Interactive checklist */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[#1A1A2E]">필수 확인 체크리스트</h4>
          <span className="text-xs font-medium text-[#10A37F]">
            {checkedCount}/{CHECKLIST_ITEMS.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mb-3 h-1.5 rounded-full bg-[#F7F7F8] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#10A37F] transition-all duration-300"
            style={{ width: `${(checkedCount / CHECKLIST_ITEMS.length) * 100}%` }}
          />
        </div>
        <div className="space-y-1">
          {CHECKLIST_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#F7F7F8]"
            >
              {checked[item.id] ? (
                <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#10A37F]" />
              ) : (
                <Square className="mt-0.5 h-4 w-4 shrink-0 text-[#D1D5DB]" />
              )}
              <span
                className={`text-sm ${
                  checked[item.id]
                    ? 'text-[#6B7280] line-through'
                    : 'text-[#1A1A2E]'
                }`}
              >
                {item.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-2">
        <div className="flex items-start gap-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-3.5 py-3">
          <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-[#1B4D8E]" />
          <div>
            <p className="text-sm font-medium text-[#1A1A2E]">등기부등본 확인</p>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              갑구에서 가압류/가처분 여부, 을구에서 근저당 설정액을 반드시 확인하세요.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-3.5 py-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#10A37F]" />
          <div>
            <p className="text-sm font-medium text-[#1A1A2E]">전세보증보험 가입</p>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              HUG, SGI서울보증, HF 주택금융공사 중 선택하여 보증보험에 가입하세요.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] px-3.5 py-3">
          <Home className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
          <div>
            <p className="text-sm font-medium text-[#1A1A2E]">전세가율 확인</p>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              매매가 대비 전세가 비율이 70%를 초과하면 깡통전세 위험이 있으니 주의하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function AIComparePage() {
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const scenarios: Scenario[] = [
    {
      id: 1,
      question: '강남구 아파트 시세 알려줘',
      oldResponse:
        '강남구 아파트 평균 시세는 약 25억원입니다. 자세한 내용은 부동산앱을 참고해주세요.',
      newResponse: <Scenario1Rich />,
    },
    {
      id: 2,
      question: '중개수수료 얼마야?',
      oldResponse:
        '매매금액에 따라 0.4~0.7%입니다. 정확한 금액은 중개사에 문의하세요.',
      newResponse: <Scenario2Rich />,
    },
    {
      id: 3,
      question: '전세 계약 시 주의사항',
      oldResponse:
        '등기부등본을 확인하고, 전입신고를 하세요. 전세보증보험 가입을 추천드립니다.',
      newResponse: <Scenario3Rich />,
    },
  ];

  const current = scenarios[scenarioIndex];

  function goNext() {
    setScenarioIndex((prev) => Math.min(prev + 1, scenarios.length - 1));
  }

  function goPrev() {
    setScenarioIndex((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div className="flex-1 overflow-y-auto pt-14 lg:pt-0">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D1FAE5]">
            <Sparkles className="h-7 w-7 text-[#10A37F]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] sm:text-3xl">
            AI 상담 고도화 데모
          </h1>
          <p className="mt-2 text-sm text-[#6B7280] sm:text-base">
            기존 챗봇과 웹 AI 상담의 차이를 비교해보세요
          </p>
        </div>

        {/* Question Display */}
        <div className="mb-6 flex items-center justify-center gap-2.5 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-sm">
          <MessageSquare className="h-5 w-5 shrink-0 text-[#1B4D8E]" />
          <p className="text-base font-semibold text-[#1A1A2E] sm:text-lg">
            &ldquo;{current.question}&rdquo;
          </p>
        </div>

        {/* Side-by-side Comparison */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left panel - 기존 챗봇 */}
          <div className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8]">
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-[#E5E7EB] px-5 py-3.5">
              <Bot className="h-5 w-5 text-[#9CA3AF]" />
              <h2 className="text-sm font-semibold text-[#6B7280]">기존 챗봇</h2>
              <span className="rounded-full bg-[#E5E7EB] px-3 py-1 text-xs font-medium text-[#6B7280]">
                기존
              </span>
            </div>

            {/* Chat area */}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              {/* User bubble */}
              <div className="mb-4 flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-[#E5E7EB] px-4 py-3 text-sm text-[#6B7280]">
                  {current.question}
                </div>
              </div>

              {/* Bot response */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D1D5DB] text-xs text-white">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-[#6B7280] shadow-sm">
                  {current.oldResponse}
                </div>
              </div>

              {/* Limitations indicator */}
              <div className="mt-auto pt-6">
                <div className="flex items-center gap-1.5 rounded-lg bg-[#E5E7EB]/60 px-3 py-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#9CA3AF]" />
                  <span className="text-xs text-[#9CA3AF]">텍스트 응답만 지원</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - AI 상담 고도화 */}
          <div className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-[#E5E7EB] px-5 py-3.5">
              <Sparkles className="h-5 w-5 text-[#10A37F]" />
              <h2 className="text-sm font-semibold text-[#1A1A2E]">AI 상담 고도화</h2>
              <span className="rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-medium text-[#10A37F]">
                고도화
              </span>
            </div>

            {/* Chat area */}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              {/* User bubble */}
              <div className="mb-4 flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-[#F7F7F8] px-4 py-3 text-sm text-[#1A1A2E]">
                  {current.question}
                </div>
              </div>

              {/* AI rich response */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1B4D8E] text-xs font-bold text-white">
                  강
                </div>
                <div className="min-w-0 flex-1">{current.newResponse}</div>
              </div>

              {/* Capabilities indicator */}
              <div className="mt-auto pt-6">
                <div className="flex items-center gap-1.5 rounded-lg bg-[#D1FAE5]/50 px-3 py-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#10A37F]" />
                  <span className="text-xs text-[#10A37F]">
                    차트 · 계산기 · 체크리스트 · 가이드 지원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Navigation */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={goPrev}
            disabled={scenarioIndex === 0}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] transition-all hover:border-[#1B4D8E] hover:text-[#1B4D8E] disabled:opacity-30 disabled:hover:border-[#E5E7EB] disabled:hover:text-[#6B7280]"
            aria-label="이전 시나리오"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {scenarios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setScenarioIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === scenarioIndex
                    ? 'w-8 bg-[#1B4D8E]'
                    : 'w-2.5 bg-[#E5E7EB] hover:bg-[#D1D5DB]'
                }`}
                aria-label={`시나리오 ${idx + 1}`}
              />
            ))}
          </div>

          <span className="text-sm font-medium text-[#6B7280]">
            {scenarioIndex + 1} / {scenarios.length}
          </span>

          <button
            onClick={goNext}
            disabled={scenarioIndex === scenarios.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] transition-all hover:border-[#1B4D8E] hover:text-[#1B4D8E] disabled:opacity-30 disabled:hover:border-[#E5E7EB] disabled:hover:text-[#6B7280]"
            aria-label="다음 시나리오"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Summary Banner */}
        <div className="mt-10 mb-8 rounded-2xl border border-[#E5E7EB] bg-gradient-to-br from-[#E3F2FD] to-[#D1FAE5] p-6 shadow-sm">
          <h3 className="mb-4 text-center text-base font-bold text-[#1A1A2E] sm:text-lg">
            웹 AI 상담 고도화로 이렇게 달라집니다
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3">
              <TrendingUp className="h-5 w-5 shrink-0 text-[#1B4D8E]" />
              <div className="min-w-0">
                <p className="text-xs text-[#6B7280]">응답 형식</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-[#9CA3AF] line-through">
                    텍스트만
                  </span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-[#10A37F]" />
                  <span className="text-sm font-semibold text-[#1B4D8E]">
                    차트+테이블+체크리스트
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3">
              <Sparkles className="h-5 w-5 shrink-0 text-[#10A37F]" />
              <div className="min-w-0">
                <p className="text-xs text-[#6B7280]">상담 품질</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-[#9CA3AF] line-through">
                    단순 안내
                  </span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-[#10A37F]" />
                  <span className="text-sm font-semibold text-[#1B4D8E]">
                    실시간 계산
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3">
              <MessageSquare className="h-5 w-5 shrink-0 text-[#1B4D8E]" />
              <div className="min-w-0">
                <p className="text-xs text-[#6B7280]">사용자 경험</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-[#9CA3AF] line-through">
                    외부 앱 필요
                  </span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-[#10A37F]" />
                  <span className="text-sm font-semibold text-[#1B4D8E]">
                    원스톱 해결
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
