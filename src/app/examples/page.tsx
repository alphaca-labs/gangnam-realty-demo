'use client';

import {
  Image,
  FileText,
  BookOpen,
  Download,
  Building2,
  PieChart,
  Eye,
  ChevronRight,
  ArrowRight,
  Stamp,
} from 'lucide-react';

/* ──────────────────────────────────────────────
   비교 배너 컴포넌트
   ────────────────────────────────────────────── */
function ComparisonBanner({
  kakao,
  web,
}: {
  kakao: string;
  web: string;
}) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border text-xs">
      {/* 카카오톡 */}
      <div className="flex flex-1 items-center gap-2 bg-gray-50 px-3 py-2.5">
        <span className="shrink-0 rounded-md bg-gray-200 px-1.5 py-0.5 font-semibold text-gray-500">
          카카오톡
        </span>
        <span className="text-muted-foreground">{kakao}</span>
      </div>
      {/* 구분선 */}
      <div className="flex w-px items-center bg-border">
        <ArrowRight className="relative -left-1.5 h-3 w-3 rounded-full bg-white text-accent" />
      </div>
      {/* 웹 */}
      <div className="flex flex-1 items-center gap-2 bg-accent-light/40 px-3 py-2.5">
        <span className="shrink-0 rounded-md bg-accent/10 px-1.5 py-0.5 font-semibold text-accent">
          웹에서는
        </span>
        <span className="font-medium text-foreground">{web}</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   이미지 플레이스홀더 카드
   ────────────────────────────────────────────── */
function ImagePlaceholderCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      {children}
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-foreground">{title}</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   문서 뷰어 카드
   ────────────────────────────────────────────── */
function DocumentViewerCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* 문서 헤더 */}
      <div className="border-b bg-gray-50 px-4 py-2.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      {/* 문서 본문 */}
      <div className="p-4">{children}</div>
      {/* 하단 버튼 */}
      <div className="border-t bg-gray-50/60 px-4 py-2.5">
        <button
          disabled
          className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary opacity-60"
        >
          <Eye className="h-3.5 w-3.5" />
          전체 보기
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   메인 페이지
   ────────────────────────────────────────────── */
export default function ExamplesPage() {
  return (
    <div className="flex-1 overflow-y-auto pt-14 lg:pt-0">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            웹버전 타입별 출력 예시
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            카카오톡 대비 웹 AI 상담의 다양한 출력 형태
          </p>
        </div>

        {/* 3-column 그리드 */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* ════════════ Column 1 - 이미지 ════════════ */}
          <section className="flex flex-col gap-4">
            {/* 섹션 제목 */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Image className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">이미지</h2>
            </div>

            {/* 비교 배너 */}
            <ComparisonBanner
              kakao="저해상도 썸네일 1장"
              web="고화질 갤러리 + 확대/슬라이드"
            />

            {/* 카드 1: 단지 외관 */}
            <ImagePlaceholderCard title="단지 외관">
              <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-[#1B4D8E] via-[#2563EB] to-[#60A5FA]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)]" />
                <div className="flex flex-col items-center gap-2 text-white/90">
                  <Building2 className="h-10 w-10" />
                  <span className="text-sm font-medium">래미안 블레스티지</span>
                  <span className="text-xs text-white/60">압구정동 123</span>
                </div>
                {/* 슬라이드 인디케이터 */}
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  <span className="h-1.5 w-4 rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                </div>
              </div>
            </ImagePlaceholderCard>

            {/* 카드 2: 시세 인포그래픽 */}
            <ImagePlaceholderCard title="시세 인포그래픽">
              <div className="flex h-44 flex-col justify-end gap-1.5 bg-gradient-to-b from-gray-50 to-white px-5 pb-4 pt-5">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  강남구 주요 단지 평당가 (만원)
                </p>
                <div className="flex items-end gap-2">
                  {[
                    { label: '압구정', h: '100%', color: 'bg-primary' },
                    { label: '대치', h: '82%', color: 'bg-primary/80' },
                    { label: '도곡', h: '68%', color: 'bg-primary/60' },
                    { label: '삼성', h: '74%', color: 'bg-primary/70' },
                    { label: '역삼', h: '55%', color: 'bg-primary/50' },
                  ].map((bar) => (
                    <div key={bar.label} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t-md ${bar.color} transition-all`}
                        style={{ height: bar.h, minHeight: 12 }}
                      />
                      <span className="text-[10px] text-muted-foreground">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ImagePlaceholderCard>

            {/* 카드 3: 분석 차트 */}
            <ImagePlaceholderCard title="분석 차트">
              <div className="flex h-44 items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
                {/* CSS 파이 차트 */}
                <div className="relative h-28 w-28">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'conic-gradient(#1B4D8E 0% 42%, #10A37F 42% 68%, #60A5FA 68% 85%, #E5E7EB 85% 100%)',
                    }}
                  />
                  <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white">
                    <PieChart className="h-5 w-5 text-primary/50" />
                  </div>
                </div>
                {/* 범례 */}
                <div className="ml-5 flex flex-col gap-1.5">
                  {[
                    { label: '아파트', color: 'bg-primary', pct: '42%' },
                    { label: '오피스텔', color: 'bg-accent', pct: '26%' },
                    { label: '빌라', color: 'bg-blue-400', pct: '17%' },
                    { label: '기타', color: 'bg-gray-200', pct: '15%' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5 text-[11px]">
                      <span className={`h-2 w-2 rounded-full ${item.color}`} />
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="ml-auto font-medium text-foreground">{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ImagePlaceholderCard>
          </section>

          {/* ════════════ Column 2 - 서류 ════════════ */}
          <section className="flex flex-col gap-4">
            {/* 섹션 제목 */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="h-4 w-4 text-accent" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">서류</h2>
            </div>

            {/* 비교 배너 */}
            <ComparisonBanner
              kakao="텍스트 요약만 전달"
              web="문서 뷰어에서 직접 열람"
            />

            {/* 등기부등본 */}
            <DocumentViewerCard title="등기부등본 (견본)">
              <div className="relative space-y-3">
                {/* 문서 스타일 헤더 */}
                <div className="border-b-2 border-double border-gray-800 pb-2 text-center">
                  <p className="text-[10px] tracking-widest text-muted-foreground">
                    대한민국 법원 등기국
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-foreground">
                    부동산 등기사항전부증명서
                  </p>
                  <p className="text-[10px] text-muted-foreground">(말소사항 포함)</p>
                </div>

                {/* 표제부 */}
                <div>
                  <p className="mb-1 text-[10px] font-semibold text-primary">
                    [ 표제부 ] (건물의 표시)
                  </p>
                  <div className="overflow-hidden rounded border text-[10px]">
                    <div className="grid grid-cols-3 gap-px bg-gray-200">
                      <div className="bg-gray-100 px-2 py-1 font-medium">소재지번</div>
                      <div className="col-span-2 bg-white px-2 py-1">
                        서울 강남구 압구정로 123
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-px bg-gray-200">
                      <div className="bg-gray-100 px-2 py-1 font-medium">건물명칭</div>
                      <div className="col-span-2 bg-white px-2 py-1">
                        래미안 블레스티지 제101동
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-px bg-gray-200">
                      <div className="bg-gray-100 px-2 py-1 font-medium">면적</div>
                      <div className="col-span-2 bg-white px-2 py-1">
                        84.92m&sup2; (전용)
                      </div>
                    </div>
                  </div>
                </div>

                {/* 갑구 */}
                <div>
                  <p className="mb-1 text-[10px] font-semibold text-primary">
                    [ 갑구 ] (소유권에 관한 사항)
                  </p>
                  <div className="overflow-hidden rounded border text-[10px]">
                    <div className="grid grid-cols-4 gap-px bg-gray-200">
                      <div className="bg-gray-100 px-2 py-1 font-medium">순위</div>
                      <div className="bg-gray-100 px-2 py-1 font-medium">등기목적</div>
                      <div className="bg-gray-100 px-2 py-1 font-medium">접수일자</div>
                      <div className="bg-gray-100 px-2 py-1 font-medium">소유자</div>
                    </div>
                    <div className="grid grid-cols-4 gap-px bg-gray-200">
                      <div className="bg-white px-2 py-1">1</div>
                      <div className="bg-white px-2 py-1">소유권이전</div>
                      <div className="bg-white px-2 py-1">2023.05.15</div>
                      <div className="bg-white px-2 py-1">홍길동</div>
                    </div>
                  </div>
                </div>

                {/* 관인 (도장) 목업 */}
                <div className="absolute -bottom-1 right-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-300/60 text-center">
                  <div className="flex flex-col">
                    <Stamp className="mx-auto h-3 w-3 text-red-400/60" />
                    <span className="text-[7px] font-bold leading-tight text-red-400/60">
                      등기관
                      <br />
                      확인
                    </span>
                  </div>
                </div>
              </div>
            </DocumentViewerCard>

            {/* 건축물대장 */}
            <DocumentViewerCard title="건축물대장 (견본)">
              <div className="relative space-y-3">
                {/* 문서 스타일 헤더 */}
                <div className="border-b-2 border-double border-gray-800 pb-2 text-center">
                  <p className="text-[10px] tracking-widest text-muted-foreground">
                    국토교통부
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-foreground">
                    건축물대장 (일반)
                  </p>
                </div>

                {/* 기본 정보 */}
                <div className="overflow-hidden rounded border text-[10px]">
                  <div className="grid grid-cols-3 gap-px bg-gray-200">
                    <div className="bg-gray-100 px-2 py-1 font-medium">대지위치</div>
                    <div className="col-span-2 bg-white px-2 py-1">
                      서울 강남구 삼성동 45-6
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-gray-200">
                    <div className="bg-gray-100 px-2 py-1 font-medium">주용도</div>
                    <div className="col-span-2 bg-white px-2 py-1">공동주택 (아파트)</div>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-gray-200">
                    <div className="bg-gray-100 px-2 py-1 font-medium">구조</div>
                    <div className="col-span-2 bg-white px-2 py-1">
                      철근콘크리트구조
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-gray-200">
                    <div className="bg-gray-100 px-2 py-1 font-medium">층수</div>
                    <div className="col-span-2 bg-white px-2 py-1">지하2층 / 지상35층</div>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-gray-200">
                    <div className="bg-gray-100 px-2 py-1 font-medium">사용승인일</div>
                    <div className="col-span-2 bg-white px-2 py-1">2021.08.20</div>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-gray-200">
                    <div className="bg-gray-100 px-2 py-1 font-medium">연면적</div>
                    <div className="col-span-2 bg-white px-2 py-1">
                      158,432.56m&sup2;
                    </div>
                  </div>
                </div>

                {/* 관인 (도장) 목업 */}
                <div className="absolute -bottom-1 right-2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-300/60 text-center">
                  <div className="flex flex-col">
                    <Stamp className="mx-auto h-3 w-3 text-red-400/60" />
                    <span className="text-[7px] font-bold leading-tight text-red-400/60">
                      구청장
                      <br />
                      직인
                    </span>
                  </div>
                </div>
              </div>
            </DocumentViewerCard>
          </section>

          {/* ════════════ Column 3 - 문서·양식 가이드 ════════════ */}
          <section className="flex flex-col gap-4">
            {/* 섹션 제목 */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <BookOpen className="h-4 w-4 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">문서·양식 가이드</h2>
            </div>

            {/* 비교 배너 */}
            <ComparisonBanner
              kakao="링크만 전달, 이탈 필요"
              web="가이드 + 양식 다운로드 한번에"
            />

            {/* 거래신고서 작성 가이드 */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="border-b bg-gray-50 px-4 py-2.5">
                <p className="text-sm font-semibold text-foreground">
                  거래신고서 작성 가이드
                </p>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {[
                    {
                      step: 1,
                      title: '부동산거래관리시스템 접속',
                      desc: 'RTMS(rtms.molit.go.kr) 접속 후 공동인증서 로그인',
                    },
                    {
                      step: 2,
                      title: '거래신고서 작성',
                      desc: '거래유형 선택 후 매수/매도인 정보, 물건 소재지, 거래금액 입력',
                    },
                    {
                      step: 3,
                      title: '첨부서류 등록',
                      desc: '매매계약서 사본, 신분증 사본 등 필요서류 PDF 업로드',
                    },
                    {
                      step: 4,
                      title: '신고 제출 및 확인',
                      desc: '내용 검토 후 전자서명으로 제출, 신고필증 즉시 발급',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {item.step}
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 양식 다운로드 */}
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="border-b bg-gray-50 px-4 py-2.5">
                <p className="text-sm font-semibold text-foreground">양식 다운로드</p>
              </div>
              <div className="flex flex-col gap-2 p-4">
                {[
                  { label: '부동산 매매계약서', size: 'PDF, 245KB' },
                  { label: '임대차계약서', size: 'PDF, 198KB' },
                  { label: '부동산 거래신고서', size: 'PDF, 312KB' },
                ].map((doc) => (
                  <button
                    key={doc.label}
                    disabled
                    className="flex items-center gap-3 rounded-xl border bg-gray-50/80 px-4 py-3 text-left opacity-70 transition-colors"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                      <Download className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{doc.label}</p>
                      <p className="text-[11px] text-muted-foreground">{doc.size}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
                <p className="mt-1 text-center text-[11px] text-muted-foreground">
                  데모 버전 - 실제 다운로드는 서비스 오픈 시 제공
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
