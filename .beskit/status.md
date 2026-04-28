# Project Status — gangnam-realty-demo

> Single Source of Truth. 모든 spec 진행 상황은 여기서 관리.

Last updated: 2026-04-27

## Active Spec

- **004-land-permit-ai-redesign** — 토지거래허가 AI 독립 레이아웃 + 디자인 전면 개편
  - Phase: Do — G1/G2/G3 완료, G4 빌드 통과
  - Group: G4 (Build/Verify) 완료 — npm run build 통과, 회귀 grep 0건
  - Owner: eng (구현 완료) → 후속 Learn 대기
  - Path: `.beskit/specs/004-land-permit-ai-redesign/`
  - Notes: route group `(main)` / `(lp-ai)` 로 chrome 격리. 13개 main 페이지는 `(main)/*` 로 이동, `/land-permit-ai`는 `(lp-ai)/*` 로 이동. tokens.css는 `.lp-ai-root` scope (globals.css 침범 0). next/font(Gowun_Batang/JetBrains_Mono) + Pretendard CDN. v2 컴포넌트 18+ 파일(Logo/Avatar/AIBubble/AIText/UserBubble/RichCard/Typing/LpSidebar/ChatHeader/NoticeBanner/Composer/ChatTimeline/ResultReport/Icons + cards: FormCard/ParcelCard/StepCard/SummaryTable/ChoiceCard/types/derive-slots/summary-rows). ChatRoot REWRITE — 백엔드 호출(/api/gemini/chat, hydrate, persist, sendMessage, handleRetry, handleReset) 모두 보존. message.ts에 optional slots/meta 확장, store.ts에 reviewing status + OPEN_REVIEW/CLOSE_REVIEW. 폐기 6 파일(ChatTranscript/MessageBubble/CaseSelector/MissingFieldsForm/PreviewPanel/ActionFooter) 삭제, buildDocuments는 engine/documents.ts로 추출. ResultReport는 view-transition 방식 (별도 라우트 X), PDF는 buildDocuments+generatePermitZip 재사용. PII 마스킹 maskRrnInString 그대로 (summary-rows.ts/ResultReport 적용). Gemini/auto-lookup/providers/share/engine/answer-mapper/data/lib 변경 0.

## Specs Index

| ID  | Name                       | Status   | Group | Path                                        |
| --- | -------------------------- | -------- | ----- | ------------------------------------------- |
| 001 | land-permit-ai             | superseded-by-evolution | -     | `.beskit/specs/001-land-permit-ai/`         |
| 002 | land-permit-ai-gemini      | done(예상)/integrated | -     | `.beskit/specs/002-land-permit-ai-gemini/`  |
| 003 | auto-land-lookup           | done     | -     | `.beskit/specs/003-auto-land-lookup/`       |
| 004 | land-permit-ai-redesign    | do/build-pass | G4 | `.beskit/specs/004-land-permit-ai-redesign/` |

## Recent Activity

- 2026-04-27 `.beskit/` 구조 초기화
- 2026-04-27 spec 001-land-permit-ai 생성 (spec.md + todos.md)
- 2026-04-27 spec 002-land-permit-ai-gemini 생성 — 결정 트리 → Gemini 자연어 대화로 evolution. 정적 export 제거.
- 2026-04-27 spec 003-auto-land-lookup 생성 — 002의 evolution. Kakao + VWorld 자동 조회로 지목/면적/용도지역 자동 반영.
- 2026-04-27 spec 003 eng 구현 완료 — `llm/lookup/*` 모듈(types/pnu/cache/kakao/vworld) + `llm/auto-lookup.ts` orchestrator + route.ts hook + ChatRoot banner. `server-only` 가드, env 참조 1곳씩, 빌드 통과, 클라이언트 leak 0건.
- 2026-04-27 spec 004-land-permit-ai-redesign 생성 — `/land-permit-ai/*` 자체 layout 분리(공용 Sidebar 비노출) + 디자인 패키지 토큰/컴포넌트(AIBubble/UserBubble/AIText/RichCard 6타입 등) 적용 + 멀티턴 응답 포맷 다양화. 002/003 백엔드 재사용, same-repo, iOS 프레임 X.
- 2026-04-27 spec 004 eng 구현 완료 — route group `(main)` / `(lp-ai)` 로 chrome 격리. tokens.css는 `.lp-ai-root` scope (globals.css 침범 0). next/font Gowun_Batang/JetBrains_Mono. v2 컴포넌트 18+ 파일 (Logo/Avatar/AIBubble/AIText/UserBubble/RichCard/Typing/LpSidebar/ChatHeader/NoticeBanner/Composer/ChatTimeline/ResultReport/Icons + cards). ChatRoot REWRITE — 백엔드 호출 보존. message.ts에 optional slots/meta. store.ts reviewing status. 폐기 6 파일 삭제, buildDocuments는 engine/documents.ts. ResultReport view-transition + PDF 재사용. PII 마스킹 그대로. npm run build 통과, 결정 트리 잔재 0, env leak 0.

## Next Actions

1. arch — 라우트 그룹 정확한 경로, 카드 타입 분기 정책, 디자인 패키지(JSX) → React+TS 매핑 규칙, 스타일 격리 전략 결정
2. eng — G1(Foundation) 병렬 작업 시작: styles.css 토큰 도입 / route group 레이아웃 분리 / 폰트 로드 / 컴포넌트 매핑 가이드 / 메시지 타입 확장
3. (보류) 003 Learn Phase — `note.md`의 `[x]` 항목을 CLAUDE.md에 반영

## Notes

- 004는 002+003의 evolution(deps: [002, 003]). 002의 `/api/gemini/chat`/reducer/share/answer-mapper, 003의 auto-lookup/providers/cache는 그대로 재사용. 변경 영역은 프런트엔드 레이아웃/디자인 시스템/메시지 렌더링 파이프라인에 한정.
- 라우트 격리: `/land-permit-ai/*`만 자체 layout. 다른 라우트(`/`, `/calculator`, `/civil`, `/land-permit`, `/ai-compare`, `/contract`, `/checklist`, `/business-registration`, `/employment`, `/examples`, `/map`, `/prices`)는 회귀 0.
- 스타일 격리: 디자인 패키지 토큰은 land-permit-ai scope로만 도입. `src/app/globals.css` leak 금지.
- 디자인 패키지 위치: `/tmp/design-package/gangnam/` (styles.css / chat-components.jsx / chat-screens.jsx / extra-screens.jsx).
- 003 Notes 유지: 'No API calls' / 'Static Export' 규칙은 land-permit-ai 한정 무효화. 004도 동일 영역이라 동일 적용.
- 결정 트리 잔재 부재(`scenarios|conditional|selectors|ChatEngine`) 유지 정책은 004에서도 가드(T-405).
- PII 마스킹(주민번호)은 새 카드 렌더링 경로(특히 SummaryTable/AIText/FormCard)에서도 유지(T-306).
- 기존 `/land-permit` (절차형) 페이지는 변경 금지 (T-403 회귀 확인 범위에 포함).
