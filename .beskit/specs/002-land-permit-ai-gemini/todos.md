# Todos — 002 land-permit-ai-gemini

> 병렬 그룹(Group)별로 묶어 동시 실행. 같은 그룹 내 [P] 태그 작업은 서로 독립적으로 병렬 가능.
> 각 TODO는 1-2시간 내 완료를 목표로 분해됨.
> 세부 아키텍처(모듈 구조, 스키마 변환 전략, prompt 본문, 에러 처리)는 arch 결과를 참조하여 구현한다.

## Phase Layout

- **G1 — Foundation (의존성 없음, 모두 병렬)**
- **G2 — Core 구현 (G1 완료 후, 내부 병렬 가능)**
- **G3 — Integration (G2 완료 후)**
- **G4 — Build/Verify (마지막)**

## Tasks

| ID    | Task                                                                                                                          | Status | Deps              | Group |
| ----- | ----------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------- | ----- |
| T-101 | [P] Gemini SDK 패키지 설치(`@google/genai` 또는 `@google/generative-ai` — arch 결정안 적용) 및 lockfile 반영                  | ⏳     | -                 | G1    |
| T-102 | [P] (선택) `zod` 설치 — arch가 스키마 검증에 필요하다고 결정한 경우에만                                                       | ⏳     | -                 | G1    |
| T-103 | [P] `/api/gemini/chat` request/response 타입 정의 (메시지 히스토리, 현재 DTO 부분 상태, 추출 결과, 어시스턴트 발화)            | ⏳     | -                 | G1    |
| T-104 | [P] DTO(`src/data/land-permit.ts`) → Gemini JSON Schema 변환 모듈 작성 (4 케이스 공통/분기 표현)                              | ⏳     | -                 | G1    |
| T-105 | [P] system prompt 작성: 4 케이스 분기 안내, 한 응답에 여러 필드 추출 허용, 누락 필드 한국어로 자연스럽게 재질문, 위험/보안 가드레일 | ⏳     | -                 | G1    |
| T-106 | [P] `next.config.ts`에서 `output: 'export'`, `basePath: '/gangnam-realty-demo'` 제거 + 관련 GitHub Pages 전용 설정 정리        | ⏳     | -                 | G1    |
| T-107 | [P] 결정 트리 코드 제거 — `src/features/land-permit-ai/engine/{ChatEngine,selectors,conditional,validation}.ts` 삭제          | ⏳     | -                 | G1    |
| T-108 | [P] 결정 트리 코드 제거 — `src/features/land-permit-ai/scenarios/*` 전체 삭제                                                 | ⏳     | -                 | G1    |
| T-109 | [P] 결정 트리 코드 제거 — `src/features/land-permit-ai/state/{reducer,actions}.ts` 삭제 (G2에서 재작성)                       | ⏳     | -                 | G1    |
| T-110 | [P] 결정 트리 전용 입력 컴포넌트 정리 — `src/features/land-permit-ai/components/inputs/*` 중 LLM 흐름에 불필요한 항목 식별/삭제 | ⏳     | -                 | G1    |
| T-111 | [P] `.env.example`에 `GEMINI_API_KEY` 항목 추가 + 환경변수 설정 방법을 관련 파일 인라인 코멘트로 안내 (별도 README 파일 생성 X) | ⏳     | -                 | G1    |
| T-112 | [P] `engine/answer-mapper.ts` 잔존 여부 확인 및 LLM 추출 결과(부분 DTO) → 7개 form 변환 호환성 점검 메모 (코드 변경은 G2)      | ⏳     | -                 | G1    |
| T-201 | `/api/gemini/chat` route 구현: server-only, `GEMINI_API_KEY` 사용, function calling/responseSchema로 부분 DTO 추출 + 다음 발화 반환 | ⏳     | T-101,T-103,T-104,T-105 | G2 |
| T-202 | API route 에러 핸들링: 키 미설정/네트워크 실패/스키마 검증 실패 → 사용자 노출용 한국어 일반 메시지로 변환, 내부 스택/키 leak 차단 | ⏳     | T-201             | G2    |
| T-203 | 클라이언트 상태 reducer 재작성 (`state/reducer.ts`, `state/actions.ts`): 메시지 히스토리 + 누적 DTO + 진행 케이스 + 로딩/에러   | ⏳     | T-103,T-109       | G2    |
| T-204 | `ChatRoot`/`ChatTranscript` LLM 응답 처리: 사용자 메시지 → API 호출 → 누적 DTO 머지 → 어시스턴트 발화 렌더                     | ⏳     | T-201,T-203       | G2    |
| T-205 | 사용자 메시지 전송 UI: 단일 텍스트 입력 중심으로 단순화 (Enter 전송, 멀티라인, 전송 중 비활성화, 에러 표시)                    | ⏳     | T-203             | G2    |
| T-206 | 미리보기 결합: 누적 DTO가 케이스별 필수 필드를 모두 만족하면 기존 미리보기 컴포넌트 트리거                                    | ⏳     | T-203,T-112       | G2    |
| T-301 | `/land-permit-ai` 페이지 wiring: 신규 reducer + LLM API 호출 + 미리보기/다운로드/QR 결합                                       | ⏳     | T-204,T-206       | G3    |
| T-302 | URL+QR 동기화 유지: 누적 DTO ↔ URL 직렬화(기존 `share/*`) + QR 컴포넌트 동작 확인                                              | ⏳     | T-301             | G3    |
| T-303 | 누락 필드 검증/수정 UX: 사용자가 자연어로 특정 필드 정정 요청 시 LLM이 해당 필드만 갱신하도록 흐름 검증                       | ⏳     | T-301             | G3    |
| T-304 | 환경변수 문서화 마무리: `.env.example` 점검 + 관련 코드 인라인 코멘트로 `GEMINI_API_KEY` 안내                                  | ⏳     | T-111,T-301       | G3    |
| T-305 | 사이드바 라벨 갱신 검토: "토지거래허가 (AI 챗봇)" 라벨/설명이 자연어 대화 전환과 일치하는지 확인 후 필요 시 수정               | ⏳     | T-301             | G3    |
| T-401 | `npm run build` 통과 (정적 export 제거된 일반 Next.js 빌드)                                                                   | ⏳     | T-301..T-305      | G4    |
| T-402 | 4 케이스(self-occupy / non-residential / tax-deferral / proxy) 자연어 흐름 수동 점검 메모 (`note.md` 작성)                    | ⏳     | T-401             | G4    |
| T-403 | 기존 `/land-permit` (절차형) 페이지 회귀 없음 확인                                                                            | ⏳     | T-401             | G4    |
| T-404 | 결정 트리 잔재 0건 검증: `engine/{ChatEngine,selectors,conditional,validation}`, `scenarios/*` grep으로 부재 확인              | ⏳     | T-401             | G4    |

## Status Legend

- ⏳ Pending
- 🔄 Active
- ✅ Done
- ⛔ Blocked

## Parallelization Notes

- G1: T-101 ~ T-112 모두 병렬 가능 — 신규 추가(T-101~T-105, T-111)와 제거(T-107~T-110)는 파일이 분리되어 충돌 없음. T-106(`next.config.ts`)도 단독 파일.
- G2:
  - T-201은 T-101/T-103/T-104/T-105 의존 — 의존만 충족되면 단독 진행
  - T-203은 T-103/T-109(삭제) 의존
  - T-204는 T-201+T-203 결합 후 진행
  - T-205는 T-203 위에서 T-204와 병렬 가능 (입력 UI vs 응답 처리)
  - T-206은 T-203+T-112(점검 메모) 위에서 진행, 미리보기 호출은 별도 파일이라 T-204/T-205와 병렬 가능
- G3: T-301 선행, 이후 T-302/T-303/T-304/T-305는 가급적 직렬 통합 (페이지 파일 충돌 회피). T-304는 환경변수 파일이라 다른 작업과 병렬 가능.
- G4: 빌드/회귀/grep은 직렬.

## 제거 대상 파일 (G1에서 모두 삭제)

- `src/features/land-permit-ai/engine/ChatEngine.ts`
- `src/features/land-permit-ai/engine/selectors.ts`
- `src/features/land-permit-ai/engine/conditional.ts`
- `src/features/land-permit-ai/engine/validation.ts`
- `src/features/land-permit-ai/scenarios/*` (디렉토리 전체)
- `src/features/land-permit-ai/state/reducer.ts` (G2에서 재작성)
- `src/features/land-permit-ai/state/actions.ts` (G2에서 재작성)
- `src/features/land-permit-ai/components/inputs/*` 중 LLM 흐름에 불필요한 항목 (T-110에서 식별)

## 보존 대상 파일 (재사용)

- `src/data/land-permit.ts`
- `src/lib/land-permit-html.ts`, `src/lib/zip-generator.ts`
- `src/features/land-permit-ai/share/*`
- `src/features/land-permit-ai/providers/*`
- `src/features/land-permit-ai/engine/answer-mapper.ts`
