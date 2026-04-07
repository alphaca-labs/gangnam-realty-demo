'use client';

import React, { useState } from "react";
import {
  FileText, Upload, CheckCircle2, Circle, Bot,
  X, AlertTriangle, Building2, UserPlus, ShieldCheck, Info,
  Paperclip, Trash2
} from "lucide-react";

// ─── 체크리스트 데이터 ──────────────────────────────────────

const CHECKLIST_REALTY = [
  {
    id: "r1",
    category: "기본 정보",
    items: [
      { id: "r1-1", label: "소재지 및 지목 확인", desc: "등기부등본 또는 토지대장 기준", required: true },
      { id: "r1-2", label: "건물 용도 및 면적", desc: "건축물대장 기준 용도, 전용면적, 공용면적", required: true },
      { id: "r1-3", label: "건축 연도 확인", desc: "사용승인일 기준", required: true },
    ],
  },
  {
    id: "r2",
    category: "권리 관계",
    items: [
      { id: "r2-1", label: "소유권 확인 (등기부등본 갑구)", desc: "소유자명, 공유 여부, 가등기 확인", required: true },
      { id: "r2-2", label: "근저당권/전세권 확인 (등기부등본 을구)", desc: "채권최고액, 설정일, 권리자 확인", required: true },
      { id: "r2-3", label: "압류/가압류/가처분 여부", desc: "등기부등본 갑구 확인", required: true },
      { id: "r2-4", label: "임차인 현황 (전입세대 열람)", desc: "확정일자, 전입일 기준 우선순위", required: true },
    ],
  },
  {
    id: "r3",
    category: "시설 상태",
    items: [
      { id: "r3-1", label: "수도/전기/가스 시설 상태", desc: "계량기 위치, 개별/중앙 난방 여부", required: true },
      { id: "r3-2", label: "벽면/천장/바닥 상태", desc: "균열, 누수, 곰팡이 여부 확인", required: false },
      { id: "r3-3", label: "방수/배수 상태", desc: "화장실, 베란다 방수 및 하수구 상태", required: false },
      { id: "r3-4", label: "창호/단열 상태", desc: "이중창 여부, 단열재 시공 상태", required: false },
    ],
  },
  {
    id: "r4",
    category: "기타 확인사항",
    items: [
      { id: "r4-1", label: "관리비/공과금 미납 여부", desc: "관리사무소 및 세무서 확인", required: true },
      { id: "r4-2", label: "재건축/재개발 여부", desc: "정비구역 지정 및 추진 상황", required: false },
      { id: "r4-3", label: "학교/교통 접근성", desc: "학군, 지하철/버스 거리", required: false },
    ],
  },
];

const CHECKLIST_EMPLOYMENT = [
  {
    id: "e1",
    category: "근로자 기본 서류",
    items: [
      { id: "e1-1", label: "근로계약서", desc: "근로기준법에 따른 필수 기재사항 포함", required: true },
      { id: "e1-2", label: "주민등록등본", desc: "근로자 인적사항 확인용", required: true },
      { id: "e1-3", label: "통장 사본", desc: "급여 입금 계좌 확인", required: true },
    ],
  },
  {
    id: "e2",
    category: "사업장 서류",
    items: [
      { id: "e2-1", label: "사업자등록증", desc: "사업장 정보 및 사업자번호 확인", required: true },
      { id: "e2-2", label: "고용보험 성립신고서", desc: "고용노동부 신고 필수", required: true },
      { id: "e2-3", label: "건강보험 자격취득신고서", desc: "국민건강보험공단 신고", required: true },
      { id: "e2-4", label: "국민연금 자격취득신고서", desc: "국민연금공단 신고", required: true },
    ],
  },
  {
    id: "e3",
    category: "외국인 근로자 추가 서류",
    items: [
      { id: "e3-1", label: "외국인등록증", desc: "체류자격 및 체류기간 확인", required: false },
      { id: "e3-2", label: "체류자격 확인서", desc: "출입국관리사무소 발급", required: false },
      { id: "e3-3", label: "취업활동 허가증", desc: "체류자격별 취업 가능 여부 확인", required: false },
      { id: "e3-4", label: "여권 사본", desc: "신원 확인 및 체류기간 확인", required: false },
    ],
  },
  {
    id: "e4",
    category: "신고 및 등록",
    items: [
      { id: "e4-1", label: "고용보험 피보험자격 취득 신고", desc: "채용일로부터 14일 이내 신고", required: true },
      { id: "e4-2", label: "4대보험 가입 증명", desc: "각 공단에서 발급", required: true },
      { id: "e4-3", label: "건강진단서", desc: "업종에 따라 필수 (식품, 의료 등)", required: false },
    ],
  },
];

const CHECKLIST_BUSINESS = [
  {
    id: "b1",
    category: "기본 등록 서류",
    items: [
      { id: "b1-1", label: "사업자등록증", desc: "국세청 발급 (신규 사업자)", required: true },
      { id: "b1-2", label: "임대차계약서", desc: "사업장 소재지 확인용", required: true },
      { id: "b1-3", label: "신분증 사본", desc: "대표자 또는 사업주 신분 확인", required: true },
      { id: "b1-4", label: "도장 (인감)", desc: "서류 제출 및 계약용", required: true },
    ],
  },
  {
    id: "b2",
    category: "사업장 관련 서류",
    items: [
      { id: "b2-1", label: "건축물대장", desc: "건물 용도 및 면적 확인", required: true },
      { id: "b2-2", label: "등기부등본", desc: "소유권 및 근저당권 확인", required: true },
      { id: "b2-3", label: "평면도", desc: "시설 배치 및 소방시설 배치용", required: false },
      { id: "b2-4", label: "주차장 확보 증명", desc: "법정 주차대수 확인 (업종별)", required: false },
    ],
  },
  {
    id: "b3",
    category: "인허가 서류",
    items: [
      { id: "b3-1", label: "소방안전검사 필증", desc: "소방서 점검 후 발급", required: true },
      { id: "b3-2", label: "위생교육 이수증", desc: "식품/보건 업종 필수", required: false },
      { id: "b3-3", label: "영업신고증", desc: "업종별 인허가 (식품, 숙박 등)", required: false },
      { id: "b3-4", label: "환경영향평가서", desc: "대형 사업장 또는 특정 업종", required: false },
    ],
  },
  {
    id: "b4",
    category: "보험 및 기타",
    items: [
      { id: "b4-1", label: "화재보험 가입증명", desc: "재산 피해 대비 필수", required: true },
      { id: "b4-2", label: "배상책임보험 가입증명", desc: "고객 안전사고 대비", required: false },
      { id: "b4-3", label: "통신판매업 신고증", desc: "온라인 판매 시 필수", required: false },
    ],
  },
];

// ─── Component ──────────────────────────────────────────────

export default function ChecklistHelperV3() {
  const [activeTab, setActiveTab] = useState("realty");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<Record<string, string>>({});
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const getCurrentChecklist = () => {
    if (activeTab === "realty") return CHECKLIST_REALTY;
    if (activeTab === "employment") return CHECKLIST_EMPLOYMENT;
    return CHECKLIST_BUSINESS;
  };

  const checklist = getCurrentChecklist();

  const allItems = checklist.flatMap(cat => cat.items);
  const requiredItems = allItems.filter(item => item.required);
  const checkedCount = allItems.filter(item => checkedItems[item.id]).length;
  const requiredCheckedCount = requiredItems.filter(item => checkedItems[item.id]).length;

  const progressPercent = allItems.length > 0 ? Math.round((checkedCount / allItems.length) * 100) : 0;
  const requiredProgressPercent = requiredItems.length > 0 ? Math.round((requiredCheckedCount / requiredItems.length) * 100) : 0;

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileUpload = (itemId: string) => {
    const fakeFilename = `document_${Math.random().toString(36).substr(2, 9)}.pdf`;
    setFiles(prev => ({ ...prev, [itemId]: fakeFilename }));
  };

  const handleFileRemove = (itemId: string) => {
    setFiles(prev => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  const requestAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisOpen(true);
    }, 2000);
  };

  const getAnalysisResult = () => {
    if (activeTab === "realty") {
      return {
        summary: "중개대상물 확인서 검토 결과",
        items: [
          { type: "warning", text: "근저당권 설정액이 매매가의 80%를 초과합니다. 잔금 처리 시 주의가 필요합니다." },
          { type: "success", text: "소유권 이전 이력이 명확하며, 가등기 등 제한사항이 없습니다." },
          { type: "info", text: "전입세대 열람 시 확정일자 우선순위를 재확인하시기 바랍니다." },
        ],
        recommendation: "전반적으로 양호하나, 대출 상환 계획을 면밀히 확인 후 계약을 진행하세요.",
      };
    } else if (activeTab === "employment") {
      return {
        summary: "고용신고 서류 검토 결과",
        items: [
          { type: "success", text: "근로계약서 필수 기재사항이 모두 포함되어 있습니다." },
          { type: "warning", text: "외국인 근로자의 체류자격이 3개월 내 만료 예정입니다. 갱신 절차를 진행하세요." },
          { type: "info", text: "4대보험 가입 신고는 채용일로부터 14일 이내 완료해야 합니다." },
        ],
        recommendation: "체류자격 갱신을 우선 처리하고, 보험 신고를 기한 내 완료하세요.",
      };
    } else {
      return {
        summary: "개설 등록 서류 검토 결과",
        items: [
          { type: "success", text: "소방안전검사 필증이 정상적으로 발급되었습니다." },
          { type: "warning", text: "임대차계약서 상 용도가 '근린생활시설'이지만, 실제 영업 예정 업종과 일치하는지 확인이 필요합니다." },
          { type: "info", text: "식품 관련 업종의 경우 위생교육 이수증이 필수입니다. 구청 위생과에 문의하세요." },
        ],
        recommendation: "용도 불일치 문제를 임대인과 협의하고, 위생교육을 조속히 이수하세요.",
      };
    }
  };

  const analysisResult = getAnalysisResult();
  const uncheckedRequired = requiredItems.filter(item => !checkedItems[item.id]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold">강남구청 행정 서비스 도우미</h1>
          <p className="mt-1 text-sm text-neutral-600">
            체크리스트 기반으로 필요한 서류를 확인하고 AI 분석을 받을 수 있습니다.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("realty")}
              className={`rounded-t-lg px-4 py-3 text-sm font-medium transition ${
                activeTab === "realty"
                  ? "bg-neutral-50 text-neutral-950"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <Building2 className="mr-2 inline-block h-4 w-4" />
              중개대상물 확인서 도우미
            </button>
            <button
              onClick={() => setActiveTab("employment")}
              className={`rounded-t-lg px-4 py-3 text-sm font-medium transition ${
                activeTab === "employment"
                  ? "bg-neutral-50 text-neutral-950"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <UserPlus className="mr-2 inline-block h-4 w-4" />
              고용신고 도우미
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`rounded-t-lg px-4 py-3 text-sm font-medium transition ${
                activeTab === "business"
                  ? "bg-neutral-50 text-neutral-950"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              <ShieldCheck className="mr-2 inline-block h-4 w-4" />
              개설 등록 도우미
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Checklist */}
          <div className="lg:col-span-2 space-y-6">
            {checklist.map((category) => (
              <div key={category.id} className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">{category.category}</h2>
                <div className="space-y-3">
                  {category.items.map((item) => {
                    const isChecked = checkedItems[item.id];
                    const hasFile = !!files[item.id];
                    return (
                      <div key={item.id} className="flex items-start gap-3 rounded border p-3">
                        <button
                          onClick={() => toggleCheck(item.id)}
                          className="mt-1 shrink-0"
                        >
                          {isChecked ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-neutral-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium ${isChecked ? "line-through text-neutral-500" : ""}`}>
                              {item.label}
                            </p>
                            {item.required && (
                              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                필수
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-neutral-600">{item.desc}</p>
                          {hasFile ? (
                            <div className="mt-2 flex items-center gap-2 rounded bg-neutral-100 px-3 py-2 text-sm">
                              <Paperclip className="h-4 w-4 text-neutral-600" />
                              <span className="flex-1 text-neutral-700">{files[item.id]}</span>
                              <button
                                onClick={() => handleFileRemove(item.id)}
                                className="text-neutral-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleFileUpload(item.id)}
                              className="mt-2 flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950"
                            >
                              <Upload className="h-4 w-4" />
                              파일 첨부
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">진행 현황</h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-neutral-600">전체 항목</span>
                    <span className="font-medium">{progressPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full bg-neutral-900 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    {checkedCount} / {allItems.length} 완료
                  </p>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-neutral-600">필수 항목</span>
                    <span className="font-medium">{requiredProgressPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full bg-green-600 transition-all"
                      style={{ width: `${requiredProgressPercent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    {requiredCheckedCount} / {requiredItems.length} 완료
                  </p>
                </div>
              </div>

              {uncheckedRequired.length > 0 && (
                <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3">
                  <p className="mb-2 text-sm font-medium text-amber-900">미확인 필수 항목</p>
                  <ul className="space-y-1">
                    {uncheckedRequired.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => toggleCheck(item.id)}
                          className="w-full text-left text-sm text-amber-800 hover:underline"
                        >
                          • {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {requiredCheckedCount === requiredItems.length && requiredItems.length > 0 && (
                <div className="mt-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-900">
                  필수 항목을 모두 확인했습니다.
                </div>
              )}
            </div>

            {/* AI Analysis */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-semibold">AI 분석</h3>
              <p className="mb-4 text-sm text-neutral-600">
                체크한 항목을 바탕으로 AI가 서류 및 절차를 검토합니다.
              </p>
              <button
                onClick={requestAnalysis}
                disabled={analyzing}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4" />
                    AI 분석 요청
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Analysis Dialog */}
      {analysisOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{analysisResult.summary}</h2>
                <p className="mt-1 text-sm text-neutral-600">AI 검토 결과입니다.</p>
              </div>
              <button
                onClick={() => setAnalysisOpen(false)}
                className="text-neutral-500 hover:text-neutral-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {analysisResult.items.map((item, idx) => {
                const Icon = item.type === "warning" ? AlertTriangle : item.type === "success" ? CheckCircle2 : Info;
                const color =
                  item.type === "warning"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : item.type === "success"
                    ? "border-green-200 bg-green-50 text-green-900"
                    : "border-blue-200 bg-blue-50 text-blue-900";
                return (
                  <div key={idx} className={`flex gap-3 rounded border p-3 ${color}`}>
                    <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm">{item.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded border bg-neutral-50 p-4">
              <p className="text-sm font-medium text-neutral-900">권고사항</p>
              <p className="mt-2 text-sm text-neutral-700">{analysisResult.recommendation}</p>
            </div>

            <button
              onClick={() => setAnalysisOpen(false)}
              className="mt-4 w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
