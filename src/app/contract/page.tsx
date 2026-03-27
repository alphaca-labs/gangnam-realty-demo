'use client';

import { useState } from 'react';
import {
  FileText, Check, ExternalLink, ChevronRight,
  ShieldCheck, Wrench, Sofa, AlertTriangle,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

type ContractType = '매매' | '전세' | '월세';

interface Step {
  title: string;
  desc: string;
}

const procedures: Record<ContractType, Step[]> = {
  매매: [
    { title: '매물확인', desc: '부동산 매물 현장 방문 및 시세 확인' },
    { title: '계약서 작성', desc: '매매계약서 작성 및 특약사항 협의' },
    { title: '계약금 입금', desc: '매매대금의 5~10% 계약금 지급' },
    { title: '중도금', desc: '계약 후 1~2개월 내 중도금 지급' },
    { title: '잔금/등기이전', desc: '잔금 지급과 동시에 소유권 이전등기' },
    { title: '거래신고', desc: '30일 이내 부동산 거래신고 완료' },
  ],
  전세: [
    { title: '매물확인', desc: '전세 매물 현장 방문 및 시세 확인' },
    { title: '등기부 열람', desc: '등기부등본으로 권리관계 확인' },
    { title: '계약서 작성', desc: '전세계약서 작성 및 특약사항 협의' },
    { title: '계약금 입금', desc: '전세보증금의 5~10% 계약금 지급' },
    { title: '잔금/입주', desc: '잔금 지급 후 입주' },
    { title: '전입신고/확정일자', desc: '전입신고 및 확정일자 받기 (대항력 확보)' },
  ],
  월세: [
    { title: '매물확인', desc: '월세 매물 현장 방문 및 시세 확인' },
    { title: '등기부 열람', desc: '등기부등본으로 권리관계 확인' },
    { title: '계약서 작성', desc: '임대차계약서 작성 및 특약사항 협의' },
    { title: '보증금 입금', desc: '보증금 지급 및 영수증 수령' },
    { title: '입주', desc: '열쇠 인수 및 입주' },
    { title: '전입신고/임대차신고', desc: '전입신고 및 임대차 신고 (30일 이내)' },
  ],
};

const documents: Record<ContractType, string[]> = {
  매매: [
    '신분증',
    '인감증명서',
    '등기권리증',
    '매매계약서 2부',
    '부동산거래신고서',
  ],
  전세: [
    '신분증',
    '전세계약서 2부',
    '주민등록등본',
    '확정일자 신청서',
  ],
  월세: [
    '신분증',
    '임대차계약서 2부',
    '주민등록등본',
    '임대차 신고서',
  ],
};

const specialClauses = [
  {
    icon: AlertTriangle,
    title: '잔금 지급 전 권리변동 시 계약 해제',
    content:
      '잔금 지급일 이전에 근저당권 설정, 가압류, 가처분 등 권리변동이 발생할 경우 매수인은 본 계약을 해제할 수 있으며, 매도인은 계약금의 배액을 배상한다.',
  },
  {
    icon: Wrench,
    title: '하자보수 특약',
    content:
      '입주 후 3개월 이내 발견되는 누수, 곰팡이, 보일러 고장 등 주요 하자에 대해 매도인(임대인)이 수선 비용을 부담한다.',
  },
  {
    icon: Sofa,
    title: '옵션 승계 특약',
    content:
      '에어컨 2대, 냉장고, 세탁기, 빌트인 가스레인지 등 기존 옵션은 현 상태 그대로 승계하며, 이에 대한 별도 비용은 청구하지 않는다.',
  },
  {
    icon: ShieldCheck,
    title: '전세보증금 반환보증 가입 특약',
    content:
      '임차인은 전세보증금 반환보증보험(HUG/SGI)에 가입할 수 있으며, 임대인은 이에 필요한 서류를 성실히 제공한다.',
  },
];

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export default function ContractPage() {
  const [activeType, setActiveType] = useState<ContractType>('매매');
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  function toggleDoc(doc: string) {
    setCheckedDocs((prev) => ({ ...prev, [doc]: !prev[doc] }));
  }

  const contractTitle =
    activeType === '매매' ? '부동산 매매계약서(견본)' : '임대차계약서(견본)';

  return (
    <div className="h-full overflow-y-auto pt-14 lg:pt-0">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              전자계약 가이드
            </h1>
          </div>
          <p className="text-muted-foreground">
            부동산 전자계약 절차와 필요 서류를 안내합니다
          </p>
        </div>

        {/* ── Type Tabs ── */}
        <Tabs
          defaultValue={0}
          onValueChange={(val) => {
            const types: ContractType[] = ['매매', '전세', '월세'];
            setActiveType(types[val as number] ?? '매매');
            setCheckedDocs({});
          }}
        >
          <TabsList className="mb-8 w-full bg-muted rounded-xl p-1">
            <TabsTrigger
              value={0}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium"
            >
              매매
            </TabsTrigger>
            <TabsTrigger
              value={1}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium"
            >
              전세
            </TabsTrigger>
            <TabsTrigger
              value={2}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium"
            >
              월세
            </TabsTrigger>
          </TabsList>

          {(['매매', '전세', '월세'] as ContractType[]).map((type, idx) => (
            <TabsContent key={type} value={idx}>
              {/* ── 1. Contract Procedure Timeline ── */}
              <section className="mb-10">
                <h2 className="mb-6 text-lg font-semibold text-foreground">
                  계약 절차
                </h2>
                <div className="relative pl-8">
                  {/* Vertical line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
                  {procedures[type].map((step, i) => (
                    <div key={i} className="relative mb-6 last:mb-0">
                      {/* Dot */}
                      <div className="absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-white">
                        <span className="text-[10px] font-bold text-primary">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                      {i < procedures[type].length - 1 && (
                        <ChevronRight className="absolute -left-[26px] top-8 h-3 w-3 rotate-90 text-primary/40" />
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* ── 2. Required Documents Checklist ── */}
              <section className="mb-10">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  필요 서류 체크리스트
                </h2>
                <div className="rounded-2xl border bg-white p-5">
                  <div className="flex flex-col gap-3">
                    {documents[type].map((doc) => {
                      const key = `${type}-${doc}`;
                      const checked = checkedDocs[key] ?? false;
                      return (
                        <label
                          key={key}
                          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                        >
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={checked}
                            onClick={() => toggleDoc(key)}
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                              checked
                                ? 'border-accent bg-accent text-white'
                                : 'border-input bg-white'
                            }`}
                          >
                            {checked && <Check className="h-3 w-3" />}
                          </button>
                          <span
                            className={`text-sm ${
                              checked
                                ? 'text-muted-foreground line-through'
                                : 'text-foreground'
                            }`}
                          >
                            {doc}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-xs text-accent">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>
                      모든 서류를 준비한 후 계약을 진행하세요.
                    </span>
                  </div>
                </div>
              </section>
            </TabsContent>
          ))}
        </Tabs>

        {/* ── 3. Sample Contract Preview ── */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            계약서 견본
          </h2>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-6 sm:p-8">
            {/* Document title */}
            <div className="mb-6 text-center">
              <h3
                className="text-xl font-bold text-foreground sm:text-2xl"
                style={{ fontFamily: 'serif' }}
              >
                {contractTitle}
              </h3>
              <div className="mx-auto mt-2 h-0.5 w-24 bg-foreground/20" />
            </div>

            {/* Document body */}
            <div
              className="space-y-4 text-sm leading-relaxed text-foreground/80"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              {/* 소재지 */}
              <div className="flex gap-2">
                <span className="shrink-0 font-semibold text-foreground min-w-[80px]">
                  소재지
                </span>
                <span className="border-b border-dashed border-foreground/30 flex-1 pb-0.5">
                  서울특별시 강남구 압구정로 123, ○○아파트 제101동 제15층 제1501호
                </span>
              </div>

              {activeType === '매매' ? (
                <>
                  <div className="flex gap-2">
                    <span className="shrink-0 font-semibold text-foreground min-w-[80px]">
                      매매대금
                    </span>
                    <span className="border-b border-dashed border-foreground/30 flex-1 pb-0.5">
                      금 이십삼억원정 (&#8361;2,300,000,000)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 font-semibold text-foreground min-w-[80px]">
                      계약금
                    </span>
                    <span className="border-b border-dashed border-foreground/30 flex-1 pb-0.5">
                      금 이억삼천만원정 (&#8361;230,000,000) — 계약 시 지급
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 font-semibold text-foreground min-w-[80px]">
                      잔금
                    </span>
                    <span className="border-b border-dashed border-foreground/30 flex-1 pb-0.5">
                      금 이십억칠천만원정 (&#8361;2,070,000,000) — 2026년 5월 30일
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <span className="shrink-0 font-semibold text-foreground min-w-[80px]">
                      보증금
                    </span>
                    <span className="border-b border-dashed border-foreground/30 flex-1 pb-0.5">
                      {activeType === '전세'
                        ? '금 팔억원정 (₩800,000,000)'
                        : '금 오천만원정 (₩50,000,000)'}
                    </span>
                  </div>
                  {activeType === '월세' && (
                    <div className="flex gap-2">
                      <span className="shrink-0 font-semibold text-foreground min-w-[80px]">
                        월 차임
                      </span>
                      <span className="border-b border-dashed border-foreground/30 flex-1 pb-0.5">
                        금 이백만원정 (₩2,000,000) — 매월 25일 지급
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className="shrink-0 font-semibold text-foreground min-w-[80px]">
                      임대기간
                    </span>
                    <span className="border-b border-dashed border-foreground/30 flex-1 pb-0.5">
                      2026년 6월 1일 ~ 2028년 5월 31일 (24개월)
                    </span>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <span className="shrink-0 font-semibold text-foreground min-w-[80px]">
                  계약일자
                </span>
                <span className="border-b border-dashed border-foreground/30 flex-1 pb-0.5">
                  2026년 3월 27일
                </span>
              </div>

              {/* Signatures */}
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-foreground/10 pt-6">
                <div className="text-center">
                  <p className="mb-2 text-xs font-semibold text-foreground">
                    {activeType === '매매' ? '매도인' : '임대인'}
                  </p>
                  <div className="mx-auto h-12 w-24 rounded border border-dashed border-foreground/20 flex items-center justify-center text-xs text-muted-foreground">
                    (인)
                  </div>
                </div>
                <div className="text-center">
                  <p className="mb-2 text-xs font-semibold text-foreground">
                    {activeType === '매매' ? '매수인' : '임차인'}
                  </p>
                  <div className="mx-auto h-12 w-24 rounded border border-dashed border-foreground/20 flex items-center justify-center text-xs text-muted-foreground">
                    (인)
                  </div>
                </div>
              </div>
            </div>

            {/* Watermark */}
            <div className="mt-4 text-center">
              <span className="inline-block rounded-full bg-foreground/5 px-4 py-1 text-xs text-muted-foreground">
                견본 — 실제 계약 효력 없음
              </span>
            </div>
          </div>
        </section>

        {/* ── 4. Special Clauses ── */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            특약 예시
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {specialClauses.map((clause) => (
              <div
                key={clause.title}
                className="rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <clause.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {clause.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {clause.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. External Link ── */}
        <section className="mb-8">
          <a
            href="https://irts.molit.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <ExternalLink className="h-4 w-4" />
            부동산거래 전자계약시스템 바로가기
          </a>
        </section>
      </div>
    </div>
  );
}
