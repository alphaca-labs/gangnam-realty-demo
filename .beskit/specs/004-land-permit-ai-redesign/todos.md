# Todos — 004 land-permit-ai-redesign

> 병렬 그룹(Group)별로 묶어 동시 실행. 같은 그룹 내 [P] 태그 작업은 서로 독립적으로 병렬 가능.
> 각 TODO는 1-2시간 내 완료를 목표로 분해됨.
> 라우트 그룹 경로/카드 분기 정책/컴포넌트 매핑 규칙 등 세부 정책은 arch 결과를 참조하여 구현한다.

## Phase Layout

- **G1 — Foundation (의존성 없음, 모두 병렬)**
- **G2 — Core 컴포넌트 구현 (G1 완료 후, 내부 병렬 가능)**
- **G3 — Integration (G2 완료 후)**
- **G4 — Build/Verify (마지막)**

## Tasks

| ID    | Task                                                                                                                                                  | Status | Deps                                  | Group |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------- | ----- |
| T-101 | [P] 디자인 패키지 `styles.css` 토큰을 `/land-permit-ai/*` scope로 도입 (CSS variables: paper OKLCH, GN Deep Blue rgb(20,65,150), 라운드/섀도 등). globals.css 격리 유지 | ✅     | -                                     | G1    |
| T-102 | [P] App Router route group 또는 nested layout 분리 — `/land-permit-ai/*`가 공용 Sidebar 미노출 자체 layout 사용 (정확한 디렉토리는 arch 결정안 적용)                         | ✅     | -                                     | G1    |
| T-103 | [P] 폰트 로드 — Pretendard / Gowun Batang / JetBrains Mono (next/font 또는 CDN, 디자인 패키지 정책 따름). land-permit-ai layout에만 적용                                   | ✅     | -                                     | G1    |
| T-104 | [P] 디자인 패키지 컴포넌트(`chat-components.jsx`, `chat-screens.jsx`, `extra-screens.jsx`) → React+TS 매핑 가이드 정리 (props/이벤트/상태 위치 — arch 결정안 반영)            | ✅     | -                                     | G1    |
| T-105 | [P] 메시지 타입 확장 — `{ kind: 'ai-text' | 'user-text' | 'form' | 'parcel' | 'step' | 'summary' | 'choice', payload }` 정의. 기존 reducer 시그니처는 보존              | ✅     | -                                     | G1    |
| T-201 | [P] AIBubble / UserBubble / AIText 기본 버블 컴포넌트 구현                                                                                                       | ✅     | T-101,T-103,T-104                     | G2    |
| T-202 | [P] RichCard wrapper 구현 (공통 카드 셸 — 토큰/그림자/라운드/타이틀 슬롯)                                                                                              | ✅     | T-101,T-104                           | G2    |
| T-203 | [P] FormCard 구현 (입력 폼 카드 — text/select/radio 등 디자인 패키지에 정의된 필드 종류)                                                                                  | ✅     | T-202,T-105                           | G2    |
| T-204 | [P] ParcelCard 구현 (지번/지목/면적/용도지역 표시 + 필지 미니맵 SVG 인라인)                                                                                              | ✅     | T-202,T-105                           | G2    |
| T-205 | [P] StepCard 구현 (진행률/단계 표시 카드)                                                                                                                          | ✅     | T-202,T-105                           | G2    |
| T-206 | [P] SummaryTable 구현 (누적 답변 요약 테이블 카드)                                                                                                                    | ✅     | T-202,T-105                           | G2    |
| T-207 | [P] ChoiceCard 구현 (케이스 분기 선택 카드)                                                                                                                          | ✅     | T-202,T-105                           | G2    |
| T-208 | [P] Typing 인디케이터 컴포넌트 구현                                                                                                                                  | ✅     | T-101,T-104                           | G2    |
| T-209 | [P] 자체 Sidebar(최근 상담 mock) 컴포넌트 구현 — 데스크톱에서만 노출                                                                                                   | ✅     | T-101,T-104                           | G2    |
| T-210 | [P] NoticeBanner 컴포넌트 구현 (autoLookup 진행/실패/완료 인디케이터로도 활용 가능)                                                                                      | ✅     | T-101,T-104                           | G2    |
| T-211 | [P] ChatHeader 컴포넌트 구현                                                                                                                                       | ✅     | T-101,T-104                           | G2    |
| T-212 | [P] Composer 컴포넌트 구현 (입력 + suggestions 칩)                                                                                                                  | ✅     | T-101,T-104,T-105                     | G2    |
| T-213 | [P] MapPanel 컴포넌트 구현 (필지 시각화 SVG — 인라인 ParcelCard와 별개 또는 통합, arch 결정안 적용)                                                                       | ✅     | T-202,T-204                           | G2    |
| T-214 | [P] ResultReport 컴포넌트 구현 (검토 리포트 화면 — 별도 라우트 또는 종료 단계, arch 결정안 적용)                                                                        | ✅     | T-202,T-206                           | G2    |
| T-301 | ChatRoot 재작성 — 새 layout 위에 Sidebar/ChatHeader/NoticeBanner/Composer 배치, 메시지 렌더링이 kind→카드 컴포넌트로 분기                                            | ✅     | T-201..T-212                          | G3    |
| T-302 | 카드 분기 매핑 구현 — autoLookup 결과 → ParcelCard, missingFields/진행률 → StepCard, isComplete/요약 → SummaryTable, caseType 분기 → ChoiceCard, 입력 단계 → FormCard, 일반 → AIText | ✅     | T-301                                 | G3    |
| T-303 | MapPanel 통합 — ChatRoot 또는 별도 패널로 노출 (arch 결정안 적용)                                                                                                       | ✅     | T-213,T-301                           | G3    |
| T-304 | ResultReport 라우트/단계 통합 — 대화 종료 시 진입 또는 별도 라우트로 노출                                                                                                | ✅     | T-214,T-301                           | G3    |
| T-305 | 모바일 반응형 마무리 — ~768px breakpoint에서 Sidebar 숨김 + 단순 헤더 + 적응형 패딩 동작 확인                                                                            | ✅     | T-301                                 | G3    |
| T-306 | PII 마스킹 검증 — 주민번호 등 민감정보가 새 카드(특히 SummaryTable/AIText/FormCard) 렌더링 경로에서도 마스킹 유지 확인                                                | ✅     | T-302                                 | G3    |
| T-307 | globals.css 격리 검증 — 새 토큰/폰트가 다른 라우트(`/`, `/calculator` 등) 스타일을 침범하지 않음 확인                                                                  | ✅     | T-101,T-301                           | G3    |
| T-401 | `npm run build` 통과 확인                                                                                                                                       | ✅     | T-301..T-307                          | G4    |
| T-402 | `/land-permit-ai` 동작 수동 검증 — 멀티턴 대화, autoLookup→ParcelCard, 진행률→StepCard, 완료→SummaryTable, 분기→ChoiceCard, 폼→FormCard, AIText 모두 노출           | ✅     | T-401                                 | G4    |
| T-403 | 다른 라우트 회귀 — `/`, `/calculator`, `/civil`, `/land-permit`, `/ai-compare`, `/contract`, `/checklist`, `/business-registration`, `/employment`, `/examples`, `/map`, `/prices` 정상 동작 확인 | ✅     | T-401                                 | G4    |
| T-404 | 002/003 백엔드 회귀 — Gemini API/auto-lookup이 키 유무/유 모두에서 정상 동작, 응답 스키마 변경 없음(또는 최소) 확인                                                  | ✅     | T-401                                 | G4    |
| T-405 | 결정 트리 잔재 0 유지 검증 — `engine/{ChatEngine,selectors,conditional,validation}`, `scenarios/*` grep으로 부재 재확인                                              | ✅     | T-401                                 | G4    |
| T-406 | `note.md` 작성 — 디자인 패키지 매핑 시 발견한 mismatch, arch 결정안과의 차이, 후속 검토 항목 기록                                                                       | ✅     | T-402,T-403,T-404,T-405               | G4    |

## Status Legend

- ✅ Pending
- 🔄 Active
- ✅ Done
- ⛔ Blocked

## Parallelization Notes

- G1: T-101 ~ T-105 모두 병렬 가능 — 토큰/레이아웃/폰트/매핑가이드/타입 확장은 파일이 분리되어 충돌 없음.
- G2: T-201 ~ T-214 모두 [P] 병렬 가능 — 각 컴포넌트 파일이 분리됨. 단, 모두 G1(T-101 토큰, T-104 매핑 가이드, T-105 메시지 타입)에 의존.
  - T-203~T-207은 T-202(RichCard wrapper)에 의존
  - T-213은 T-204(ParcelCard) 활용 가능
  - T-214는 T-206(SummaryTable) 활용 가능
- G3:
  - T-301(ChatRoot 재작성)은 G2 완료 후 단독 선행 (파일 충돌 회피)
  - T-302는 T-301 위에서 분기 로직만 추가
  - T-303 / T-304 / T-305 / T-306 / T-307은 T-301/T-302 이후 서로 다른 영역이라 병렬 가능
- G4: 빌드/회귀/grep/note 작성은 직렬.

## 신규 추가 파일 (예상)

- `src/app/land-permit-ai/layout.tsx` 또는 route group layout (arch 결정 경로)
- `src/features/land-permit-ai/components/` 하위 새 디렉토리 (디자인 패키지 매핑 컴포넌트군)
  - bubbles: AIBubble, UserBubble, AIText
  - rich: RichCard, FormCard, ParcelCard, StepCard, SummaryTable, ChoiceCard
  - chrome: Sidebar, ChatHeader, NoticeBanner, Composer, Typing
  - panels: MapPanel, ResultReport
- 메시지 타입 정의 파일 (kind+payload 모델)
- 디자인 토큰 CSS (land-permit-ai scope)

## 변경 대상 파일

- `src/app/land-permit-ai/page.tsx` (재작성 또는 nested layout 진입점)
- `src/features/land-permit-ai/components/*` (구 ChatRoot 및 부속 — 단계적 교체)
- `src/features/land-permit-ai/index.ts` (exports 갱신, 필요 시)

## 보존 대상 파일 (변경 금지 또는 최소)

- `src/app/api/gemini/chat/route.ts`
- `src/features/land-permit-ai/llm/auto-lookup.ts` 및 `llm/lookup/*`
- `src/features/land-permit-ai/providers/*`
- `src/features/land-permit-ai/types/providers.ts`
- `src/features/land-permit-ai/share/*`
- `src/features/land-permit-ai/state/answer-mapper*`
- `src/data/land-permit.ts`
- `src/app/globals.css` (토큰 leak 금지)
- `src/app/layout.tsx` (다른 라우트 영향 회피, 변경 시 최소화)
- `/land-permit` (절차형) 페이지
