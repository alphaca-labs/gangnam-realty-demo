# Note — 004 land-permit-ai-redesign (Do Phase)

## Findings

- [x] Next.js Route Groups `(main)` / `(lp-ai)` 로 같은 도메인에 두 개의 chrome을 격리하는 패턴이 매우 깔끔함. root `layout.tsx`는 `<html><body>`만 책임지고, 각 그룹의 `layout.tsx`가 자기 chrome(Sidebar / lp-ai-root) 을 가짐. 다른 라우트 회귀 0.
- [x] 디자인 패키지 `styles.css`의 `:root` 토큰을 그대로 옮길 때, 반드시 모든 헬퍼 클래스(`.paper`, `.btn`, `.btn-primary`, `.chip`, `.scroll`, `.typing-dot`, `.pill`, `.mark`, `.tnum`, `.logo-mark`, `.map-tiles`, `.rise`, `.card`)도 `.lp-ai-root .{class}` nesting 으로 scope 해야 globals.css leak 방지. `@keyframes` 이름도 `lp-typing` / `lp-rise` 로 충돌 방지 prefix 적용.
- [x] `next/font/google` 의 `Gowun_Batang` / `JetBrains_Mono` import는 layout 파일 (서버 컴포넌트)에서만 가능. CSS variable 방식(`variable: '--lp-font-serif'`)으로 노출하고 tokens.css 에서 `var(--lp-font-serif)` 로 참조하면 깔끔.
- [x] 디자인 패키지의 inline SVG icon set 은 React+TS 로 옮길 때 `Omit<SVGProps>` extend 가 size 충돌(string vs number)로 type error 유발. 차라리 자체 props 만 정의한 가벼운 IconProps 가 안정적.
- [ ] `style jsx` (styled-jsx)는 Next.js 16에서 동작하지만 client-only. Sidebar/Header/Composer 의 mobile 반응형은 inline styled-jsx로 커버 (Tailwind 토큰을 .lp-ai-root scope에 침범시키지 않으려는 의도). 향후 CSS Module로 옮기는 것도 고려.
- [x] PreviewPanel 컴포넌트 폐기 시 `buildDocuments` 헬퍼만 `engine/documents.ts` 로 추출하여 ResultReport 가 그대로 활용. 백엔드 흐름 변경 없음.
- [ ] `caseType === null` 초기 상태에서는 ChatTimeline 가 자체적으로 hardcoded greeting + ChoiceCard 를 렌더(메시지 stream 과 분리). 즉 `state.messages` 가 비어있어도 사용자에게 케이스 선택지 제공.
- [x] 카드 분기 deriveSlots: 1) parcel — autoLookup.applied && filled.length>0, 2) form — !isComplete && missingFields.length 1~3, 3) summary — isComplete, 4) step — caseType 변경 직후 또는 진행률 stepBucket 변동 시. `lastStepEmittedRef` / `prevProgressRef` 로 중복 방출 방지.
- [ ] FormCard 가 사용자 입력을 받지 않고 "대화로 답변하기" 형태로만 동작하도록 단순화. 실제 입력은 Composer 에 그대로. (백엔드 로직 변경 회피)
- [ ] Mock 사용자 이름은 디자인 그대로 옮기지 않고 "데모 사용자" / "나" 로 일반화. 사이드바 mock 세션 4개는 `isMock: true` 로 disable.
- [x] Sidebar 폐기 (gangnam main Sidebar)는 절대 X — `/(main)/layout.tsx` 에서 그대로 import. `/land-permit-ai` 메뉴 항목은 메뉴에 그대로 유지되어 사용자가 main → AI 챗 진입 가능.
- [ ] ResultReport 의 PDF 다운로드는 기존 `generatePermitZip` 흐름을 그대로 재사용 — 추가 의존성 0.

## Decisions

- 라우트 격리 방식: route group + 각 group 의 자체 layout (next.js public-facing URL 변화 없음).
- 디자인 토큰 격리: `.lp-ai-root` className scope. globals.css 변경 0.
- 폰트 로드: `next/font/google` 로 Gowun Batang / JetBrains Mono. Pretendard 는 root layout 의 CDN preload 그대로.
- 메시지 type 확장은 optional `slots?` / `meta?` 로 backward-compatible.
- ResultReport 는 별도 라우트가 아닌 같은 페이지 view 전환 (`status: 'reviewing'`).
- Composer 의 첨부/마이크 버튼은 disabled (디자인 충실, 실제 동작 X).

## Issues / Pitfalls

- Turbopack lockfile 경고: 워크스페이스 외부 `pnpm-lock.yaml` 감지 — 기능적 영향 없음, 조용히 빌드 통과.
- styled-jsx 의 `:global` 선택자를 안 쓰고도 `lp-ai-root` 자체 scope 안에서 동작하므로 leak 가능성 낮음.
- Lucide-react 아이콘 사용 가능했지만 디자인 패키지의 stroke 1.6 일관성 유지를 위해 자체 SVG icon set 채택.
- Generation 중 `confidence` / `autoLookup` state hook 은 향후 banner / hint 용으로 보존 (현재 ChatTimeline 카드 분기에 사용되어 reachable). `void` 로 unused warning suppress.

## 후속 (Learn 후보)

- [ ] Next.js App Router route group 패턴은 멀티 chrome (예: marketing / dashboard / 외부 위젯) 분리에 강력. 향후 spec 작성 시 우선 검토.
- [x] 디자인 토큰을 root scope (`:root`) 가 아닌 컴포넌트 root 클래스 (예: `.lp-ai-root`) 에 두는 패턴은 large monorepo 에서 유사 디자인 시스템 충돌 방지에 효과적 — CLAUDE.md 에 가이드라인 추가 검토.
- [x] `next/font` CSS variable 패턴(`variable: '--xxx'`)을 서드파티 디자인 토큰과 함께 쓰면 폰트만 격리해 다른 영역에 부담 X.
