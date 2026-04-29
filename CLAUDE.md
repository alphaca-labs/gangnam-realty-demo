# CLAUDE.md

## Project: 강남부동산톡 웹버전 v2

ChatGPT 웹 UI 스타일의 AI 부동산 상담 데모 사이트.

## Key Rules
- **한국어 UI** — 모든 텍스트 한국어
- **No API calls (default)** — 데모 데이터는 하드코딩/목데이터. 예외: `src/features/land-permit-ai/`는 server-side에서 Gemini/Kakao/VWorld API 호출(`/api/gemini/chat` 라우트, `GEMINI/KAKAO_REST/VWORLD_API_KEY` env). 키 미설정 시 Mock fallback.
- **Server-side 외부 API 키 보호** — `process.env.{GEMINI,VWORLD,KAKAO_REST}_API_KEY` 등 외부 서비스 키는 `src/app/api/**`와 `src/features/*/llm/**`에서만 참조. 클라이언트 코드/`NEXT_PUBLIC_*` 노출 금지. 가급적 키별 단일 소유 모듈 1곳에서만 read.
- **server-only 모듈 격리** — 외부 API 호출/시크릿 read를 수행하는 모듈(`src/features/*/llm/lookup/**`, `llm/auto-*.ts` 등)은 파일 첫 줄 `import 'server-only'` 강제. 클라이언트 번들 leak을 빌드 단계에서 차단.
- **Mobile First** — 반응형 필수. 폼 검증 실패 후 첫 에러 필드로 이동 시 `el.focus({ preventScroll: true })` → `el.scrollIntoView({ block: 'center' })` 순서로 호출(iOS 가상키보드가 먼저 떠서 시야를 가리는 현상 방지).
- **ChatGPT 스타일 (메인 라우트)** — `src/app/(main)/**`는 사이드바 + 채팅 UI + 리치 응답. `src/app/(lp-ai)/land-permit-ai/**`는 자체 디자인 토큰/레이아웃 사용(별도 chrome).
- **Route Group 다중 chrome 격리** — 같은 repo에서 다른 layout/디자인이 필요하면 `src/app/(group-name)/...` route group + 그룹별 자체 `layout.tsx` 사용. URL 변화 없음. 라우트 추가 시 다른 그룹 회귀 0건 자동 보장.
- **디자인 토큰 root scope 격리** — 외부 디자인 시스템 토큰은 `:root`가 아닌 컴포넌트 root 클래스(`.{feature}-root`)에 scope. globals.css/Tailwind 침범 금지. `@keyframes`도 feature prefix로 충돌 회피.
- **Feature 모듈 분리** — `src/features/{name}/*`의 핵심 코어(`types/llm/state/share/utils`)는 `next/*` import 금지(환경 무관). Next 종속은 `src/app/**` 라우트/페이지에서만.
- **Zod v4 JSON Schema** — `zod-to-json-schema` 외부 패키지 금지. 내장 `z.toJSONSchema(schema, { target: 'draft-7' })` 사용.
- **PII 위젯 마스킹 정합성** — split-id 등 분할 입력 위젯이 합성한 값(`${front}-${back}`)은 PII 마스킹 정규식(`maskRrnInString`의 `\d{6}-\d{7}`)과 1:1 일치해야 하고, `isFilled`로 부분 제출(평문 leak)을 차단한다. 단일 chokepoint(Composer→sendMessage)에서만 마스킹.
- **PII at-rest 암호화 (localStorage)** — `src/features/*/state/`의 PII 포함 세션 persist는 Web Crypto AES-GCM(envelope `{v,iv,ct}`) + 디바이스 자동 키(JWK localStorage)로 암호화. 순서는 **mask → encrypt** 고정(평문이 envelope 안에 들어가지 않도록 `buildMaskedPayload` 후 `encryptJson`). `loadSession`/`persistSession`은 async, 평문 envelope 자동 마이그레이션. secure context(HTTPS/localhost) 외 평문 fallback 허용(보안 한계는 모듈 주석 명시). 공유 hash(`#share=…`)는 **비암호화 의도**(타인 공유)이므로 envelope 미적용 — share/persist 책임 경계 분리.

## Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS
- shadcn/ui
- Recharts (차트)
- Lucide React (아이콘)
- Pretendard 폰트 (CDN)

## 상세 기획서
SPEC.md 참조. 반드시 읽고 따를 것.
