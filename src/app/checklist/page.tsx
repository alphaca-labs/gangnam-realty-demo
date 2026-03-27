'use client';

import { useState } from 'react';
import { FileCheck, ChevronRight } from 'lucide-react';

export default function ChecklistPage() {
  const [step, setStep] = useState(1);

  const steps = [
    { number: 1, title: '기본정보', icon: '📍' },
    { number: 2, title: '권리관계', icon: '⚖️' },
    { number: 3, title: '시설현황', icon: '🏠' },
    { number: 4, title: '확인사항', icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">중개대상물 확인서 도우미</h1>
            <p className="text-sm text-text-secondary">단계별 작성 가이드 (데모 버전)</p>
          </div>
        </div>

        {/* 스텝 인디케이터 */}
        <div className="mb-8 bg-white p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center flex-1">
                <button
                  onClick={() => setStep(s.number)}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    step === s.number ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      step === s.number
                        ? 'bg-primary text-white'
                        : 'bg-sidebar border border-border'
                    }`}
                  >
                    {s.icon}
                  </div>
                  <span className="text-sm font-medium">{s.title}</span>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="mx-2 text-text-secondary flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 스텝 내용 */}
        <div className="bg-white p-6 rounded-xl border border-border">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>

        {/* 네비게이션 */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-3 rounded-lg border border-border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sidebar transition-colors"
          >
            이전
          </button>
          <button
            onClick={() => setStep(Math.min(4, step + 1))}
            disabled={step === 4}
            className="px-6 py-3 rounded-lg bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">1단계: 기본정보</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">소재지</label>
          <input
            disabled
            placeholder="서울시 강남구 압구정동 123-45"
            className="w-full px-4 py-3 border border-input-border rounded-lg bg-sidebar"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">면적</label>
            <input
              disabled
              placeholder="84.5㎡"
              className="w-full px-4 py-3 border border-input-border rounded-lg bg-sidebar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">용도</label>
            <select
              disabled
              className="w-full px-4 py-3 border border-input-border rounded-lg bg-sidebar"
            >
              <option>아파트</option>
            </select>
          </div>
        </div>
        <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
          <p className="text-sm text-text-secondary">
            💡 실제 서비스 오픈 시 입력 가능합니다. (데모 버전)
          </p>
        </div>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">2단계: 권리관계</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">소유자</label>
          <input
            disabled
            placeholder="홍길동"
            className="w-full px-4 py-3 border border-input-border rounded-lg bg-sidebar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">저당권 설정 여부</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" disabled name="mortgage" className="w-4 h-4" />
              <span className="text-sm">없음</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" disabled name="mortgage" className="w-4 h-4" />
              <span className="text-sm">있음</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">임차인 여부</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" disabled name="tenant" className="w-4 h-4" />
              <span className="text-sm">없음</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" disabled name="tenant" className="w-4 h-4" />
              <span className="text-sm">있음</span>
            </label>
          </div>
        </div>
        <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
          <p className="text-sm text-text-secondary">
            💡 등기부등본과 일치하는지 확인하세요.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">3단계: 시설현황</h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">방</label>
            <input
              disabled
              placeholder="3개"
              className="w-full px-4 py-3 border border-input-border rounded-lg bg-sidebar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">욕실</label>
            <input
              disabled
              placeholder="2개"
              className="w-full px-4 py-3 border border-input-border rounded-lg bg-sidebar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">주차</label>
            <input
              disabled
              placeholder="1대"
              className="w-full px-4 py-3 border border-input-border rounded-lg bg-sidebar"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">엘리베이터</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" disabled name="elevator" className="w-4 h-4" />
              <span className="text-sm">없음</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" disabled name="elevator" className="w-4 h-4" />
              <span className="text-sm">있음</span>
            </label>
          </div>
        </div>
        <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
          <p className="text-sm text-text-secondary">
            💡 실제 현장 확인 후 입력하세요.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step4() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">4단계: 확인사항</h2>
      <div className="space-y-3">
        {[
          '등기부등본 확인',
          '건축물대장 확인',
          '토지대장 확인',
          '개별·공동주택가격 확인서',
          '토지이용계획 확인서',
          '상·하수도 시설',
          '도로 및 교통',
          '관리비 내역',
        ].map((item, idx) => (
          <label key={idx} className="flex items-center gap-3 p-3 bg-sidebar rounded-lg border border-border">
            <input type="checkbox" disabled className="w-5 h-5" />
            <span className="text-sm">{item}</span>
          </label>
        ))}
      </div>
      <div className="mt-6 p-4 bg-primary-light rounded-lg border border-primary/20">
        <p className="text-sm font-medium text-primary mb-2">✅ 확인서 작성 완료</p>
        <p className="text-xs text-text-secondary">
          본 서비스 오픈 시 PDF 다운로드 및 전자서명 기능이 제공됩니다.
        </p>
      </div>
    </div>
  );
}
