# Learn — 강남부동산톡 v2

누적된 학습/결정/발견을 기록한다. CLAUDE.md에는 반복 적용할 *규칙*만 두고, 여기에는 *맥락과 디테일*을 보존한다.

---

## 2026-04-27 — 001 land-permit-ai 챗봇 어시스턴트

### Summary
절차적 `/land-permit` 페이지(폼 기반)와 동일 도메인의 토지거래허가 신청서를 채팅 UI로 한 번에 한 항목씩 받는 새 진입점 `/land-permit-ai/`를 추가. 데이터 모델/HTML 빌더/ZIP 빌더는 기존 모듈을 그대로 재사용하고, 신규 코드는 추후 별도 웹 서비스로 분리 가능하도록 `src/features/land-permit-ai/` 모듈로 격리. URL hash 기반 stateless 공유(QR + 단축링크)로 서버 저장 없이 재현 가능한 진행 상태를 제공.

### What Went Well
- **features 모듈 + `next/*` 격리**: `src/features/land-permit-ai/` 내부에서 `next/link`, `next/image`, `next/dynamic`, `next/navigation` 등 Next 종속을 사용하지 않도록 경계. 페이지 진입점(`src/app/land-permit-ai/page.tsx`)만 얇은 래퍼로 동작 → 추후 패키지/별도 SPA로 추출이 용이. 빌드 1회만에 통과.
- **Provider DI 패턴**: 주소/토지대장 조회를 `ProviderContext`로 주입(`mock-*` 기본 + `vworld-*`, `kakao-*` 스켈레톤). 데모 빌드는 100% 정적, 실 API는 키 주입 시 활성화 — "No API calls" 데모 원칙을 깨지 않으면서 실서비스 확장 경로 확보.
- **`Question.fillTargets` 추상화**: 한 입력에서 여러 폼 필드를 채우는 패턴(예: 주소 1회 선택으로 지번/지목/면적/용도지역 4필드 자동 채움). 챗봇 시나리오에서 질문 수를 크게 줄이는 핵심 수단. 절차형 폼에는 1:1 매핑이라 필요 없던 추상화.
- **lz-string + 2KB threshold + 부분 복원**: `compressToEncodedURIComponent`는 URI-safe하므로 `#s=v1.{token}` 형태로 hash에 그대로 부착. 2KB 초과 시 핵심 9개 필드(application 영역)만 인코딩하여 fallback — tax-deferral textarea 등 긴 입력 보호.
- **Edit UX 단순화**: 별도 모달 없이, 사용자가 user 메시지를 클릭 시 `JUMP_TO`로 해당 question으로 점프 + 입력 영역에 기존 값 prefill. 챗 UI 일관성 유지.

### Problems & Solutions
- **Static Export에서 hash hydration**: `output: 'export'` + `basePath`이면 SSR 컨텍스트가 없어 `useSearchParams` 동적 파싱이 의미 없음. → `'use client'` 페이지의 mount 후 `useEffect`에서 `window.location.hash`를 직접 파싱, 이후 `clearHashToken`으로 URL cleanup.
- **VWorld/Kakao 직접 호출 시 CORS / 키 노출 우려**: 실제 호출은 skeleton만 작성하고, 실 운영 시 서버 프록시를 거치는 구조 권장. 후속 spec으로 분리 가능.
- **데이터 타입 SSoT 공유 위험**: `@/data/land-permit`(혹은 동등 모듈)을 절차/챗봇 양 페이지가 공유. 한 쪽 변경 시 양쪽 빌드 검증 필요. 향후 변경이 잦아지면 CLAUDE.md 룰로 격상 검토.
- **타입 불일치 매핑**: `LandLookupResult.areaSqm`은 number, `ApplicationFormData.landArea`는 string → mapper에서 String 캐스팅으로 해결. 챗봇 입력은 number 수집 후 저장 시 string 변환.
- **양도세 유예 케이스의 신청인 매핑**: 매도인=신청인이 아니라 매도인 정보를 별도로 받음. mapper의 `applicantName/Birth/Phone/Address`는 양 케이스 모두 *매수인 기준*으로 통일하여 기존 절차 페이지와 동일한 결과 보장.

### Key Patterns (코드 보면 알 수 있는 디테일 — CLAUDE.md에는 미포함)
- `Question.fillTargets`: 챗봇 시나리오 한정 추상화. 향후 다른 챗봇 기능에 재사용 가능.
- 챗 메시지 append-only history: 답변 변경 시 기존 메시지를 두고 새 user 메시지를 append. 동일 questionId 중복 hide 여부는 reducer 개선 여지로 남김.
- privacy 동의 toggle 4개: default true로 두고 "예"를 권장 흐름으로 안내 ("최적, 최선이 아니다" 원칙 적용).
- `qrcode.react@4` `QRCodeSVG`는 `forwardRef<SVGSVGElement>` → `useRef`로 직접 받아 `XMLSerializer + canvas`로 PNG 변환.

### CLAUDE.md Updates (이번 사이클)
| Action | Target | 근거 |
|--------|--------|------|
| **DELETE** | 24~62라인 잔여 셸 스크립트 블록 | Anti-pattern: 의미 없는 노이즈, 가독성 저해. claude-md skill Exclude("noise/non-rule") 적용. |
| **ADD** | Key Rules: "Feature 모듈 분리 — `src/features/{name}/*` + 내부에서 `next/*` 금지" | 반복 적용될 아키텍처 정책. 코드만 보고 추측 불가(미래 의도 포함). 1줄 명료. |
| **ADD** | Key Rules: "No API calls" 라인에 인라인 예외 — `src/features/land-permit-ai/`만 외부 API 허용, 기본은 Mock provider | 기존 규칙과 직접 충돌하므로 같은 위치에 명시해야 향후 혼선 방지. 1줄 명료. |

ADD 수가 2건으로 자제(가이드: 2건 정도가 적정). 챗봇 엔진 구현 디테일은 모두 learn.md에만 기록.

### arch 사후 리뷰 결과
- Critical: 0
- Important: 1 — README 부재 (시스템 정책상 자동 생성 스킵)
- Minor: 3 — dead state, dead field, TODO 주석 (동작 영향 없음, 후속 처리)

### Follow-ups (후보 spec)
- VWorld/Kakao 실 API 연동: 서버 프록시 도입 + 환경변수 키 주입 흐름.
- features 모듈 패키지 추출 PoC: 별도 SPA/패키지로 빌드 가능한지 검증.
- `@/data/land-permit` 공유 모듈 변경 시 양 페이지 회귀 테스트 자동화.

---

## 2026-04-27 — 002 land-permit-ai-gemini (실제 LLM 통합)

### Summary
001의 결정 트리(`Question` 시나리오 + reducer/scenarios/conditional/selectors/EditableAnswer)를 Gemini 기반 자연어 챗봇으로 **완전 교체**. 서버 사이드 API route(`src/app/api/gemini/chat/route.ts`, runtime nodejs)에서 `@google/genai` v1.50+ 호출, `responseMimeType: 'application/json'` + `responseJsonSchema`(Zod v4 내장 `z.toJSONSchema`) 조합으로 구조화 응답 강제. `GEMINI_API_KEY`는 server-side env로만 노출. 데이터 모델/HTML/PDF/ZIP 빌더, `share/*`, `answer-mapper`, providers, mobile sticky bottom UX는 그대로 재사용. **Static Export + GitHub Pages 배포 모델은 포기**(server route 도입), Vercel류 Node 서버 배포로 전환.

### What Went Well
- **Zod v4 내장 `z.toJSONSchema()` 1발 통합**: 외부 `zod-to-json-schema`(zod v3 호환) 의존 회피 — 타입 비호환 문제를 사전 차단. Gemini `responseJsonSchema`는 표준 JSON Schema에 가까워 그대로 전달 가능.
- **`responseJsonSchema` + `responseMimeType: 'application/json'`**: function calling 없이도 모델 응답을 강제 구조화. `responseSchema`(OpenAPI subset) 대신 사용해 Zod 스키마와 1:1.
- **결정 트리 잔재 0건 grep 통과**: `engine/{ChatEngine,conditional,selectors,validation}.ts`, `scenarios/*`, `state/{reducer,actions}.ts`(구), `components/inputs/*`, `EditableAnswer.tsx`, `types/{question,scenario}.ts` 일괄 삭제. 신규 `state/store.ts`, `llm/*`로 대체.
- **클라이언트 번들 키 leak 0**: `process.env.GEMINI_API_KEY`는 `src/app/api/gemini/chat/route.ts`에서만 참조. 클라이언트는 `/api/gemini/chat` POST만 호출.
- **arch 사후 리뷰 Critical 0**: Medium 2건(public/v2 stale 정리, RRN 마스킹 정규식 보강)은 즉시 수정.

### Problems & Solutions
- **Zod v3 호환 외부 패키지 → v4 내장으로 해결**: `zod-to-json-schema`는 Zod v4와 타입 비호환. `z.toJSONSchema(schema, { target: 'draft-7' })`로 전환.
- **`@google/genai` Content.role mismatch**: SDK는 `'user'|'model'`만 허용하나 클라이언트 history는 `'user'|'assistant'` 표준. 서버 라우트에서 `assistant → model` 변환.
- **basePath 하드코딩 잔재**: `output:'export'` + `basePath:'/gangnam-realty-demo'` 제거 후 `Image src="/gangnam-realty-demo/..."`, Sidebar `isActive` 비교 등 grep으로 정리.
- **`public/v2/` 84개 stale export 산출물**: 이전 GitHub Pages export 잔재. 일괄 삭제(Medium-1).
- **주민번호 마스킹 누락 케이스**: 정규식이 하이픈 미포함 13자리만 매칭. 하이픈 포함/미포함 둘 다 매칭하도록 보강(Medium-2). localStorage 저장 직전 마스킹.

### Key Patterns (코드 보면 알 수 있는 디테일 — CLAUDE.md에는 미포함)
- **history truncation**: 최근 12쌍 유지 + 그 이전은 rolling summary 1문단으로 압축 → 토큰 폭발 방지.
- **missingFields 서버 재계산**: 모델 출력의 `missingFields`를 신뢰하지 않고 서버에서 `required-paths.ts` 기반으로 재계산 → 모델 환각 방지.
- **1회 자동 재시도**: 응답 스키마 위반 시 system prompt에 위반 사실을 추가해 1회만 retry. 무한 retry 금지.
- **에러 메시지 한국어 사용자 친화**: 503/400/502 모두 한국어, 사용자 액션 가능한 문구.
- **PreviewPanel scenario 의존 제거**: 결정 트리 잔재 제거의 일환. `missingFields: string[]`만 받음.
- **localStorage key**: `gangnam-realty:land-permit-ai:session:v1`. 마이그레이션 대비 v1 suffix 유지.

### CLAUDE.md Updates (이번 사이클)
| Action | Target | 근거 |
|--------|--------|------|
| **DELETE** | `Static Export — GitHub Pages 배포 (output: 'export', basePath: '...')` | 코드와 충돌(사실 아님). next.config.ts에서 `output:'export'` + `basePath` 제거됨. 잘못된 규칙은 즉시 삭제. |
| **MODIFY** | `No API calls` 라인 — land-permit-ai 예외를 server-side Gemini API + `/api/gemini/chat` + `GEMINI_API_KEY` env로 정확히 갱신 | 외부 주소 API 외에 LLM API도 추가됨. 룰을 현재 코드와 정렬. |
| **MODIFY** | `Feature 모듈 분리` — 핵심 코어(`types/llm/state/share/utils`)는 `next/*` 금지로 명확화. API route는 Next 종속이 자연스러움 | API route 도입으로 "모듈 내부 next/* 금지"가 모호해짐. 코어 한정으로 명확화. |
| **ADD** | `Server-side LLM key 보호` — `process.env.GEMINI_API_KEY`는 `src/app/api/**`와 `src/features/*/llm/**`에서만. 클라이언트/`NEXT_PUBLIC_*` 노출 금지 | 향후 다른 LLM/외부 API 추가 시 반복 적용될 보안 규칙. 코드만 봐서는 추측 불가(보안 의도). |
| **ADD** | `Zod v4 JSON Schema` — 외부 `zod-to-json-schema` 금지. 내장 `z.toJSONSchema()` 사용 | zod v3→v4 함정. 1줄 명료, 향후 다른 스키마 작성 시 반복 적용. |

총 5건(DELETE 1, MODIFY 2, ADD 2). "SPEC.md 참조" 줄은 SPEC.md 실재함을 확인 → 유지.

### arch 사후 리뷰 결과
- Critical: 0
- Medium: 2 — public/v2 stale 정리(완료), RRN 마스킹 정규식 보강(완료)
- Low: 2 — `retryable` flag 분리, zod v4 마이너 업데이트 회귀 모니터(deferred)

### 001과의 관계 (제거/변형/유지 메모)
**제거(002에서 사라짐)**:
- `Question.fillTargets` 추상화 — 결정 트리 자체가 제거되어 무의미.
- `lz-string + 2KB threshold + 부분 복원` — share 모듈은 유지하되 챗봇 hash hydration 흐름은 LLM 세션 기반으로 변경.
- `Edit UX(JUMP_TO)` — 메시지 클릭 점프 UX 제거. 자연어 추가 입력으로 보정.
- `Provider DI` — 챗봇 엔진에서는 제거(주소/토지대장 조회는 form 페이지에서만 사용).

**유지(002에도 살아있음)**:
- `next/*` 격리 원칙(코어 한정으로 더 명확화).
- `share/*` 모듈(QR/단축링크).
- mobile sticky bottom UX, ChatGPT 스타일 레이아웃.
- `answer-mapper`, HTML/PDF/ZIP 빌더 재사용.

001 entry는 historical record로 보존(수정 X). 위 차이는 002 entry 안에서만 메모.

### Follow-ups (후보 spec)
- Vercel 배포 가이드 문서화(`vercel.json`, env 설정, region).
- `retryable` flag를 별도 필드로 분리(현재는 메시지 기반 분류).
- `public/v2/` 잔재가 다른 경로에도 남아있는지 GH Pages cleanup 확인.
- zod v4 마이너 업데이트 시 `z.toJSONSchema` 시그니처 회귀 모니터.
- LLM 응답 evaluation harness(고정 시나리오 → 응답 스키마/필드 검증).

---

## 2026-04-27 — 003 auto-land-lookup (Gemini 흐름에 자동 토지 조회 hook)

### Summary
Gemini 챗봇이 사용자 메시지에서 토지 주소(시·도/구·군/읍·면·동) + 지번(본번/부번)을 추출하면, 서버에서 자동으로 Kakao Local(주소→b_code) + VWorld(필지 지목/면적/용도지역) 호출하여 `application.landAddress / landNumber / landKind / landArea / landUse` 5필드를 채운다. 신규 코드는 모두 `import 'server-only'`로 격리(`src/features/land-permit-ai/llm/lookup/{types,pnu,cache,kakao,vworld}.ts` + `llm/auto-lookup.ts`). `/api/gemini/chat` route는 `mergeExtractedFields` 직후 `applyAutoLandLookup` 1줄 hook + 응답에 `autoLookup` 필드 추가가 전부. 클라이언트는 transient banner(`useState<AutoLookupMeta | null>`)로만 표시하고 chat history/store/reducer/persist는 변경 0. 기존 providers/* skeleton은 그대로 유지(client-friendly skeleton vs server-only fetch 책임 분리).

### What Went Well
- **server-only 강제 + env 단일 소유권**: `process.env.VWORLD_API_KEY`/`KAKAO_REST_API_KEY` 참조는 정확히 1곳씩(`lookup/vworld.ts`, `lookup/kakao.ts`)만. orchestrator는 getter만 호출 → grep 검증/유지보수 모두 깔끔, 클라이언트 번들 leak 0건.
- **Promise.allSettled로 VWorld 두 호출 병렬화**: 지목/면적 layer와 용도지역 layer를 동시 호출 → latency 절감. 한 쪽 실패해도 가용한 데이터는 채움.
- **autoLookup.note transient state**: chat 메시지로 push하면 다음 LLM 턴 history에 포함되어 LLM이 자기 발화로 오인할 위험. `useState<AutoLookupMeta | null>` + banner로 격리하면 history 오염 0, store/reducer/persist 변경도 회피.
- **트리거 5조건으로 불필요한 외부 호출 차단**: 캐시 hit, confidence 'low', address+lot 모두 추출 안 됨, 이미 allFilled, 이전 동일 키 등 — 외부 API 호출 빈도 최소화.
- **2-tier provider 구조 보존**: 기존 `providers/*` skeleton(client-friendly)은 그대로 두고, 신규 `llm/lookup/*`(server-only fetch)만 추가. 책임 분리로 향후 클라이언트 PoC도 가능.
- **001/002 코어 변경 0**: mergeExtractedFields 직후 1줄 hook + 응답에 1필드 추가가 전부. 결정 트리/챗봇 코어/share/answer-mapper 모두 무영향.

### Problems & Solutions
- **MockProvider source ↔ orchestrator source 충돌**: 내부 source 필드를 외부 응답에 그대로 흘리면 mock vs real 구분이 모호. → orchestrator가 정규화된 `CombinedLandData` 타입으로 변환 후 응답.
- **TypeScript narrowing 함정**: early-return으로 narrow된 후 동일 비교는 "no overlap" 컴파일 에러. → 중복 비교 제거.
- **VWorld 200 OK + status:'NOT_FOUND' 케이스**: HTTP 200이어도 body에 명시적 NOT_FOUND가 올 수 있음. → status 가드를 명시적으로 처리.
- **VWorld 컬럼명 layer/version 가변성**: 레이어/버전마다 키 이름이 달라짐. → zod passthrough + asString 폴백 체인.
- **캐시 키 정정 케이스**: 사용자가 주소 정정 시 stale 응답 우려. → 키를 `sha1(${address.lower}|${lot})`로 정정 시 자연 miss.

### Key Patterns (코드 보면 알 수 있는 디테일 — CLAUDE.md에는 미포함)
- **PNU 19자리 합성**: `b_code(10) + landKind(1) + main(4) + sub(4)`. landKind=1(일반토지) 기본, 산지(2)는 후속.
- **LRU cache**: Map insertion-order + `get→delete→set` 재삽입 패턴. Node runtime 모듈-level Map은 process 라이프사이클 동안 안정(Edge runtime 불가).
- **캐시 키 normalize**: `sha1(${address.toLowerCase()}|${lot})` — 대소문자/공백 차이 흡수.
- **`landArea = String(Math.round(areaSqm))`**: schema string 호환을 위해 number → string 캐스팅.
- **자동 조회는 `application.land*`만 채움**: 다른 form 영역은 LLM이 자체 동기화. 책임 경계 명확.
- **2-tier provider**: client-friendly skeleton(`providers/*`) + server-only fetch(`llm/lookup/*`). 양쪽이 같은 도메인을 다른 환경에서 처리.

### CLAUDE.md Updates (이번 사이클)
| Action | Target | 근거 |
|--------|--------|------|
| **MODIFY** | `No API calls` 라인 — land-permit-ai 예외에 Kakao/VWorld 추가, 키 미설정 시 Mock fallback 명시 | Gemini 외에 Kakao Local + VWorld 호출이 추가됨. 룰을 현재 코드와 정렬. |
| **MODIFY** | `Server-side LLM key 보호` → `Server-side 외부 API 키 보호` 일반화 (`GEMINI/VWORLD/KAKAO_REST_API_KEY`, 키별 단일 소유 모듈 1곳 권장) | LLM 키 외에도 외부 서비스 키가 늘어남. 일반화하면 향후 다른 외부 API 추가 시에도 자동 적용. |
| **ADD** | `server-only 모듈 격리` — 외부 API/시크릿 read 모듈은 `import 'server-only'` 강제 | 반복 적용될 보안/구조 규칙. 빌드 단계 leak 차단 효과. 1줄 명료. |

총 3건(MODIFY 2, ADD 1). transient state vs chat history, narrowing 함정, VWorld 컬럼명 가변성 등은 일회성/디테일 → learn.md에만 기록.

### arch 사후 리뷰 결과
- 15/15 GO. Critical 0, High 0.
- Medium 2: cumulative deadline(Gemini+Lookup 합쳐 4s 한도 가드), VWorld HTTPS 전환.
- Low 2: `landKind` 매개변수 미사용(현재 1 고정), `allFilled` 순서 마이크로 최적화.
- 머지 차단 사유 없음.

### 사용자 결정사항 (Phase 1 잠금)
1. **API 선택**: Kakao Local + VWorld (대안 도로명주소API/공간정보 오픈API 등 배제).
2. **통합 위치**: 서버 자동 조회, Gemini 응답 전/후 — Option A(응답 직후 hook) 채택.
3. **키 정책**: `VWORLD_API_KEY` + `KAKAO_REST_API_KEY` (server-only). 미설정 시 Mock fallback으로 데모 빌드 보호.

### 001/002와의 관계 (제거/변형/유지 메모)
**유지(003에서도 살아있음)**:
- 001의 `providers/*` skeleton 구조 — client-friendly skeleton으로 보존, 책임 분리.
- 002의 Gemini 챗봇 코어/`mergeExtractedFields`/`required-paths`/system-prompt — 무변경.
- 002의 server-only env 정책 — 003에서 일반화하여 외부 API 전반에 확장.
- 002의 결정 트리 잔재 0 — 003에서도 0 유지.

**확장(003에서 추가)**:
- `applyAutoLandLookup` hook 1줄 + 응답 `autoLookup` 1필드 — 002 흐름에 비침습 추가.
- `AutoLookupMeta` transient state(client) — chat history와 분리된 banner UX.

**변경 없음**:
- 001의 share/QR/단축링크, mobile sticky UX, answer-mapper, HTML/PDF/ZIP 빌더.
- 002의 store/reducer/persist 모두 무변경.

001/002 entry는 historical record로 보존(수정 X).

### Follow-ups (후보 spec)
- **cumulative deadline**: Gemini + Lookup 합쳐 4s 한도 가드(현재는 각 호출별 timeout만).
- **VWorld HTTPS 전환**: 일부 endpoint가 http인지 점검 후 https 강제.
- **산지 코드(landKind=2) 지원**: PNU 합성 시 일반토지(1) 외 산지(2) 케이스 추가.
- **`allFilled` 순서 마이크로 최적화**: trigger 체크 순서 재배열로 fast-path 단축.
- **`landKind` 매개변수 활용**: 현재 1 고정 → 입력에서 산/임야 키워드 검출 시 자동 분기.

---

## 2026-04-27 — 004 land-permit-ai-redesign (UI 전면 재작성 + layout 격리)

### Summary
`/land-permit-ai`를 같은 repo 안에서 route group으로 layout 격리 + 디자인 패키지 기반 UI 전면 재작성. `src/app/layout.tsx`를 단순화하고 기존 main chrome(Sidebar + main wrapper)을 `src/app/(main)/layout.tsx`로 이전, lp-ai는 `src/app/(lp-ai)/land-permit-ai/layout.tsx`에서 자체 chrome(next/font Gowun Batang + JetBrains Mono, tokens.css, `.lp-ai-root` 클래스)을 가짐. v2 컴포넌트 22개 신규(`src/features/land-permit-ai/components/v2/**`), 디자인 토큰을 `.lp-ai-root` scope로 nesting하여 `globals.css` 침범 0. 백엔드(Gemini API + auto-lookup, share/encode/decode, answer-mapper, HTML/PDF/ZIP 빌더)는 0건 변경. ChatRoot REWRITE는 useEffect hydrate / fetch `/api/gemini/chat` / sendMessage / handleRetry / handleReset 로직을 그대로 보존하고 UI 트리만 v2로 교체, `deriveSlots()` 호출로 메시지에 RichSlot 첨부.

### What Went Well
- **Route group으로 chrome 격리 → 다른 12개 라우트 회귀 0건 자동 보장**: `(main)` / `(lp-ai)` 두 그룹에 각각 자체 `layout.tsx`. URL 변화 없음. 12개 페이지(`page, calculator, civil, contract, employment, examples, map, prices, land-permit, ai-compare, business-registration, checklist`)를 `(main)/`로 일괄 git mv하여 history 보존.
- **`.lp-ai-root` scope 격리 → globals.css 침범 0**: 디자인 패키지 styles.css의 `:root` 토큰을 `.lp-ai-root` scope로 변환. 모든 헬퍼 클래스(`.paper, .btn, .chip, .scroll, .typing-dot, .pill, .mark, .tnum, .logo-mark, .map-tiles, .rise, .card`)도 nesting. `@keyframes`는 `lp-typing` / `lp-rise` prefix로 충돌 방지.
- **next/font CSS variable 매핑 → tokens.css 자연 통합**: `next/font/google` Gowun Batang + JetBrains Mono의 `--lp-font-*` variable을 디자인 토큰의 폰트 변수에 그대로 매핑. 페이지 단위 폰트 격리 + FOUT 회피.
- **deriveSlots(옵션 A) → 백엔드 schema 변경 0**: 클라이언트가 `autoLookup → parcel`, `missingFields → form`, `complete → summary`, `force step` 등 컨텍스트 추론으로 6개 카드 분기. Gemini 응답 schema는 그대로 유지.
- **PreviewPanel → ResultReport view 전환(별도 라우트 X)**: status에 `'reviewing'` 추가 + `OPEN_REVIEW`/`CLOSE_REVIEW` action으로 같은 페이지에서 view 전환. share/encode/decode 호환 유지. 도메인 헬퍼 `buildDocuments`는 `engine/documents.ts`로 추출하여 `ResultReport` 재사용.
- **PII 마스킹 단일 chokepoint**: Composer → sendMessage 1곳에서만 `maskRrnInString` 적용. FormCard 등 분산 마스킹 회피로 누락 케이스 자동 차단.
- **메시지 type 확장 backward-compatible**: `slots?, meta?` optional 추가로 기존 메시지/persist 데이터 마이그레이션 0.

### Problems & Solutions
- **`:root` → `.lp-ai-root` 변환 시 헬퍼 클래스도 모두 nesting 필요**: styles.css의 token만 옮기면 `.paper` 등이 globals.css에 leak. → 모든 헬퍼 클래스를 `.lp-ai-root` 안에 nesting하는 일괄 변환 후 빌드 검증.
- **`@keyframes` 이름 충돌 우려**: `typing`, `rise` 같은 흔한 이름은 globals와 충돌 가능. → `lp-typing`, `lp-rise` prefix로 격리.
- **SVG icon TS 충돌**: `Omit<SVGProps>` 패턴이 React 19 타입과 미스매치. → 자체 `IconProps` 정의로 회피.
- **12개 페이지 일괄 이동 시 history 손실 우려**: `git mv`로 rename 추적 → blame/log 보존.
- **백엔드 0건 변경 보장**: `src/app/api/**`, `src/features/land-permit-ai/{llm, share, providers}/`, `engine/answer-mapper.ts`, `types/{answers,providers}.ts`, `utils/`, `src/data/land-permit.ts`, `src/lib/{land-permit-html, zip-generator}.ts`는 grep으로 변경 0 검증.

### Key Patterns (코드 보면 알 수 있는 디테일 — CLAUDE.md에는 미포함)
- **디자인 패키지 jsx prototype → React/TS 1:1 매핑**: 디자인 패키지의 vanilla JSX 프로토타입을 v2/ 디렉토리에 동일 구조로 React+TS 컴포넌트화. 디자인 검토 ↔ 코드 차이 최소화.
- **`deriveSlots()` 분기 로직**: `autoLookup` 결과 있으면 `parcel`, `missingFields` 있으면 `form`, `status === 'complete'` 면 `summary`, 그 외 `force step` (다음 액션 가이드). RichSlot union의 `'choice'` kind는 현재 미사용(Low follow-up).
- **`styled-jsx` for mobile responsive**: client-only 컴포넌트의 mobile 반응형 분기는 `styled-jsx`로 한정 — Tailwind 클래스가 lp-ai-root scope를 침범하지 않도록 회피.
- **Mock 사이드바 세션 4개 `isMock` 플래그**: 디자인 충실도(빈 사이드바 회피) + 데모 명확성(실 데이터 X) 동시 충족.
- **Composer 단일 chokepoint**: 첨부/마이크는 disabled, FormCard도 입력 받지 않고 "대화로 답변하기" 형태. 모든 입력은 Composer 1곳 → 마스킹/검증/전송 routing이 단순.
- **caseType=null 초기 상태**: ChatTimeline의 hardcoded greeting + ChoiceCard 렌더(메시지 stream과 분리). 메시지 history에 의존하지 않는 entry UX.
- **Lucide-react 대신 inline SVG icon set**: 디자인 패키지의 자체 stroke 1.6 icon set 채택. lucide와 stroke 폭 불일치 회피.

### CLAUDE.md Updates (이번 사이클)
| Action | Target | 근거 |
|--------|--------|------|
| **MODIFY** | `ChatGPT 스타일` 라인 — 메인 라우트(`src/app/(main)/**`) 한정 + `(lp-ai)/land-permit-ai/**`는 자체 디자인 토큰/레이아웃 명시 | route group 도입으로 단일 ChatGPT 스타일 강제가 더 이상 사실 아님. 룰을 현재 코드와 정렬. |
| **ADD** | `Route Group 다중 chrome 격리` — 다른 layout/디자인 필요 시 `src/app/(group-name)/...` + 그룹별 `layout.tsx` 사용 | 향후 다른 기능(예: admin, marketing)도 동일 패턴 반복 적용 가능. 코드만 보고는 의도(회귀 차단) 추측 불가. 1줄 명료. |
| **ADD** | `디자인 토큰 root scope 격리` — 외부 디자인 시스템 토큰은 `:root` 금지, `.{feature}-root` scope + `@keyframes` feature prefix | 외부 디자인 시스템 도입 시 반복 적용될 보안성 룰(globals 침범 차단). 코드만으로는 의도 추측 불가. 1줄 명료. |

총 3건(MODIFY 1, ADD 2). DELETE 없음. deriveSlots 패턴, FormCard 단일 chokepoint, styled-jsx, SVG TS 충돌, `@keyframes` prefix 등 일회성/디테일은 learn.md only.

### arch 사후 리뷰 결과
- GO. Critical 0, High 0.
- Medium 3: 페이지 카운트 doc drift(13→12), `deriveSlots` choice 분기 위치 차이, FormCard PII 마스킹 모델 차이(단일 chokepoint가 더 나음 — 의도 확인됨).
- Low 3: tooltip on disabled buttons 미적용, `'ts'` vs `'timestamp'` doc inaccuracy, RichSlot union의 unused `'choice'` kind.
- 모두 동작 영향 없음. 머지 차단 사유 없음.

### 사용자 결정사항 (Phase 1 잠금)
1. **분리 범위**: 같은 repo 안에서 `/land-permit-ai/*`만 자체 layout (별도 도메인/repo 분리 X, shared sidebar X).
2. **백엔드 유지**: Gemini API + auto-lookup hook 재사용, UI만 전면 재작성.
3. **모바일**: 반응형(iOS 프레임 모킹 X).

### 001/002/003과의 관계 (제거/변형/유지 메모)
**유지(004에서도 살아있음)**:
- 002의 Gemini 챗봇 코어/`mergeExtractedFields`/`required-paths`/system-prompt — 무변경.
- 002의 server-side env 정책 — 무변경.
- 002의 결정 트리 잔재 0 — 004에서도 0 유지.
- 003의 `applyAutoLandLookup` hook + `autoLookup` 응답 필드 — 무변경. `deriveSlots`가 `autoLookup`을 ParcelCard로 mapping.
- 003의 `providers/*` skeleton + `llm/lookup/*` server-only — 무변경.
- 001의 share/QR/단축링크, answer-mapper, HTML/PDF/ZIP 빌더 — 무변경.

**변경(004에서)**:
- UI 100% 재작성: ChatTranscript / MessageBubble / CaseSelector / MissingFieldsForm / PreviewPanel / ActionFooter 폐기 → v2/ 22개 컴포넌트로 교체.
- Layout 분리: `src/app/layout.tsx` 단순화, `src/app/(main)/layout.tsx` + `src/app/(lp-ai)/land-permit-ai/layout.tsx` 신규.
- 12개 페이지 `(main)/` 그룹으로 이동.
- 디자인 토큰: 신규 `tokens.css` (`.lp-ai-root` scope).
- 메시지 type 확장: `slots?, meta?` optional (backward-compatible).
- status에 `'reviewing'` 추가, `OPEN_REVIEW`/`CLOSE_REVIEW` action.
- `engine/documents.ts` 신규(PreviewPanel에서 buildDocuments 추출, ResultReport 재사용).

**확장(004에서 추가)**:
- Route group 다중 chrome 패턴 → CLAUDE.md 규칙으로 격상.
- 디자인 토큰 root scope 격리 → CLAUDE.md 규칙으로 격상.

001/002/003 entry는 historical record로 보존(수정 X).

### Follow-ups (후보 spec)
- **tooltip on disabled buttons**: Composer 첨부/마이크 disabled 상태에 hover tooltip("준비 중") 추가.
- **페이지 카운트 doc 갱신**: 13→12 (route group 이동 후) 문서 drift 정리.
- **RichSlot `'choice'` kind 제거**: 현재 미사용. union에서 제거 또는 ChoiceCard 통합 분기.
- **MapPanel v2.1 검토**: 현재 정적 이미지 기반 → 디자인 토큰과의 정합성 재평가.
- **`'ts'` vs `'timestamp'` doc**: 코드와 문서 표기 정합 정리(동작 영향 없음).

---

## 2026-04-29 — 005 land-permit-ai askFields (LLM-driven UI 의도 신호)

### Summary
land-permit-ai 채팅에서 LLM이 누락 정보를 텍스트로 나열하던 패턴을, 응답 스키마에 `askFields: string[]` (1~6 dot-paths) 신호 필드를 추가하여 derive-slots가 자동으로 FormCard 입력 버블을 생성하도록 변경. 기존 `missingFields ≤ 3` heuristic은 fallback으로 보존(3-tier graceful: askFields → missingFields → no-op). 6 files / +29/-4. 백엔드 contract(`ApiSuccess`)와 클라이언트 `AssistantTurnContext` 양쪽에 `askFields?: string[]` 추가, system-prompt 규칙 #4를 폼 자동 표시 안내로 교체. 004 코어/디자인 토큰/answer-mapper/auto-lookup 변경 0.

### What Went Well
- **Zod `.describe()` → JSON Schema description → Gemini structured output 이중 신호**: `z.toJSONSchema(schema, { target: 'draft-7' })`는 `.describe()`의 한국어 설명을 JSON Schema `description`으로 그대로 보존. 시스템 프롬프트의 규칙 #4와 스키마 description이 동일한 의도를 두 channel로 강제 → LLM 준수율 ↑.
- **3-tier graceful fallback로 회귀 차단**: `askFields(1~6) > missingFields(≤3) > []` 우선순위. 기존 heuristic 그대로 살려 LLM이 신호를 안 보내도 동작. 신규 신호 도입 시 기본값.
- **두 스키마 동기화 확인**: `zAssistantResponse`(generic)와 `buildResponseSchemaForCase`(per-case dynamic) 양쪽에 동일 필드 추가. case-별 좁은 스키마가 generic을 가리는 구조이므로 한 쪽만 추가하면 누락 — 둘 다 패치.
- **Per-turn LLM-driven UI 신호**: heuristic(`missingFields.length <= 3`)은 모든 턴에서 같은 임계값으로 자동 폼 표시 ↔ LLM이 컨텍스트 보고 직접 "이번 턴엔 폼"을 결정하는 게 더 정확. 예: 자유 대화 턴은 askFields 비움.
- **assistantMessage 30자 제한**: 폼 자동 표시 후 텍스트 안에서 필드명 반복 나열하는 LLM 습관을 시스템 프롬프트로 차단. 폼 ↔ 텍스트 중복 안내 회피.

### Problems & Solutions
- **이중 스키마 함정(Generic vs Per-case)**: `buildResponseSchemaForCase`가 case별 좁은 shape을 만들 때 generic `zAssistantResponse`를 상속/extend하지 않고 평행 정의. → 새 필드는 양쪽에 동시에 추가해야 함. 현재는 코드 중복으로 해결, 추후 base shape 추출 후 extend로 통합 검토.
- **derive-slots 분기 우선순위 결정**: `askFields ≥ 1`이면 missingFields와 무관하게 폼 표시할지 vs missingFields도 같이 검토. → 결정: askFields가 명시되면 그것만 사용(LLM 의도 우선), 없을 때만 heuristic. 1번 발화 1폼 일관성.
- **passthrough 필요성**: route.ts에서 Zod validate 후 `askFields`를 응답에 그대로 전달해야 함. validate가 unknown key를 strip하지 않도록 schema에 명시(현재 z.object 기본은 strip이지만 askFields가 schema에 정의되어 있으니 통과).

### Key Patterns (코드 보면 알 수 있는 디테일 — CLAUDE.md에는 미포함)
- **`.describe()` 한국어 설명**: `'이번 턴에 사용자에게 입력 폼으로 받을 필드의 dot-path 목록 (1~6개). 비워두면 자유 텍스트 대화.'` — Gemini가 한국어 description을 그대로 instruction으로 인식.
- **`max(6)` 제한**: 폼이 너무 길어지면 모바일 UX 저하 + LLM 환각 가능성 ↑. 6개로 cap.
- **`assistantMessage` 30자 안내 + 폼 자동 표시**: 안내 텍스트와 입력 위젯의 책임 분리. 텍스트에서 필드 반복 금지가 핵심.
- **derive-slots 분기 한 줄 추가**: `const ask = ctx.askFields?.length ? ctx.askFields : ctx.missingFields.length <= 3 ? ctx.missingFields : [];` — fallback 체인이 한 식에 표현되어 가독성 ↑.
- **AssistantTurnContext 확장**: ChatRoot가 ApiSuccess.askFields를 ctx로 그대로 전달. 클라이언트 store/persist는 무변경(메시지 한 번 그릴 때만 사용).

### CLAUDE.md Updates (이번 사이클)
| Action | Target | 근거 |
|--------|--------|------|
| **NONE** | (변경 없음) | 본 작업의 패턴 3건 모두 land-permit-ai 채팅 엔진 한정 구현 디테일. claude-md skill Include/Exclude 기준에 따라 Exclude: (a) "코드만 보고 추측 가능"(스키마 `.describe()` + 시스템 프롬프트 자체가 self-documenting), (b) "프로젝트 전반 반복 안 함"(Gemini 챗봇 1개 feature 한정), (c) "이 줄 없으면 Claude 실수?" 테스트 실패. 기존 umbrella 규칙(`Server-side 외부 API 키 보호`, `Zod v4 JSON Schema`, `Feature 모듈 분리`, `server-only 모듈 격리`)이 이미 보안/구조 측면을 cover. 신규 일반 규칙 추가 시 noise만 ↑. |

리뷰 완료 — Include 후보로 검토한 항목들과 기각 사유:
- "Zod `.describe()` → JSON Schema → LLM": Zod v4 JSON Schema 규칙의 함의이며, 현재 land-permit-ai 1곳에서만 활용 → learn.md에만 기록.
- "3-tier graceful fallback": 일반 원칙이지만 너무 추상적이고 본 프로젝트의 다른 영역(라우팅, share, answer-mapper)에 동일 패턴 반복 가능성 낮음 → learn.md에만 기록.
- "Per-turn LLM-driven UI 신호 우선": Gemini 챗봇 한정. 다른 feature가 LLM 챗봇을 추가할 때 다시 평가.

### arch 사후 리뷰 결과
- 본 spec은 `.beskit/specs/` 트랙 외 직접 진행. 사후 리뷰 미수행. 후속 평가는 다음 spec 사이클에서 통합.

### Follow-ups (후보 spec)
- **Generic vs Per-case 스키마 통합**: `zAssistantResponse`를 base로 하고 `buildResponseSchemaForCase`가 `.extend()`로 좁히는 구조로 리팩터링 → 신규 필드 추가 시 한 곳만 수정.
- **`askFields` 검증 강화**: 서버에서 dot-path 화이트리스트(`required-paths.ts` 기반) 대조하여 LLM이 존재하지 않는 필드를 보낸 경우 재시도/필터.
- **FormCard 다중 슬롯 UX**: 6개 한계까지 채워졌을 때 스크롤/접힘 처리 검토.
- **`assistantMessage` 30자 가드**: 응답 후처리에서 길이 초과 시 truncate 또는 재요청.
- **askFields evaluation harness**: 고정 시나리오 N개로 LLM이 적절한 askFields를 보내는지 회귀 테스트.

---

## 2026-04-29 — 006 land-permit-ai bimodal prompt + form widgets (radio/select/split-id)

### Summary
land-permit-ai 챗봇의 두 결함을 한 사이클에 해결. (1) **멀티턴 단절**: 사용자가 폼 필드의 의미를 묻는 질문을 해도 LLM이 같은 폼만 반복 — system-prompt 규칙 #4를 단일 lane(값 제공만)에서 **bimodal**(값 제공 lane + 설명 요청 lane)로 재작성하여, 설명 요청 시 2~4문장 답변 + askFields 유지 + extractedFields 비움을 강제. (2) **폼 위젯 빈약**: text input 일변도 → `application.rightType`(소유권/지상권) radio + 주민번호 split-id(앞 6 + 뒷 7) + select 분기를 추가. 4 files / +154/-30. 005의 askFields 신호 위에 위젯 다양성을 얹은 구조이며, 백엔드/answer-mapper/auto-lookup/share 모두 변경 0.

### What Went Well
- **Bimodal lane 분리로 멀티턴 단절 해소**: `value-provided` lane(30자 안내 + extractedFields 채움 + askFields 다음 슬롯)과 `explanation-requested` lane(2~4문장 설명 + askFields 유지 + extractedFields 비움)을 명확히 구분. LLM이 사용자 질문에 답하면서도 폼 컨텍스트를 잃지 않음. system-prompt 1곳 수정만으로 동작 변경.
- **Zod schema enum이 UI 위젯 옵션의 SSoT**: `application.rightType: z.enum(['소유권','지상권'])`이 `RADIO_OPTIONS` map의 근거. derive-slots에서 `Record<path, options[]>`로 path → options 등록 → 향후 다른 enum 필드 추가 시 한 줄로 확장 가능.
- **FieldDescriptor 확장은 additive only + legacy 분기 보존**: `type` union에 `'radio' | 'select' | 'split-id'` 3개를 additive로 추가. 기존 `'id'` 분기 + `formatRrnInput` legacy는 dead path로 보존(외부 호출자/페이지 점진 마이그레이션 보장). FormCard 분기 순서 `consent → boolean → radio → split-id → select → 기존 input`으로 backward-compatible.
- **PII 마스킹 round-trip 정합성**: split-id의 `handleSplitIdChange`가 `${front}-${back}` 정확한 포맷으로 합성 → `maskRrnInString`의 `(\d{6})-(\d{7})` 정규식이 1:1 매치 → 평문 leak 0. `isFilled`에서 `/^\d{6}-\d{7}$/` 검증으로 6자리만 입력된 부분 제출도 차단.
- **모바일 UX 고려**: radio는 `flexWrap`으로 wrap, split-id는 두 input(앞 maxLength=6, 뒷 maxLength=7 type='password'), 앞 6자리 채우면 뒷 input으로 autofocus. `splitIdBackRefs`(path별 ref) + `useCallback`으로 리렌더 최소화.
- **빌드/검증 통과**: `npx tsc --noEmit` exit 0, `npx next build` 15/15 정상.

### Problems & Solutions
- **단일 lane 시스템 프롬프트가 멀티턴 흐름 차단**: 기존 규칙 #4가 "값 제공만" 가정 → 사용자가 "지상권이 뭔가요?" 물으면 LLM이 같은 폼만 재발급. → bimodal 분기로 재작성. lane 결정 신호는 **사용자 메시지의 의도 분류**(질문 vs 답변)이며 LLM 자체 판단에 위임.
- **enum 후보 전수조사**: schemas + cases 트리 grep 결과 사용자-노출 enum은 `application.rightType` 1건만 (다른 hits는 LLM 메타/내부 API status로 사용자 입력 아님). RADIO_OPTIONS에 무차별 등록하면 LLM 메타 필드까지 폼화될 위험 → user-facing만 화이트리스트 등록.
- **split-id 부분 제출 leak 위험**: 기본 `isFilled = !!value`로 두면 사용자가 앞 6자리만 입력하고 제출 시 평문 6자리가 history/persist에 leak. → `/^\d{6}-\d{7}$/` 정규식 매치 시에만 `isFilled = true`로 게이트(arch 리뷰 High nit). 마스킹 정규식과 정확히 일치.
- **legacy 'id' 분기 유지 vs split-id 통합**: 기존 `'id'` + `formatRrnInput` 경로가 다른 페이지에서 호출될 가능성. → 분기 순서에서 split-id를 먼저 매치시키고 'id'는 fallthrough dead path로 보존. 외부 호출자가 점진 마이그레이션 가능.

### Key Patterns (코드 보면 알 수 있는 디테일 — CLAUDE.md에는 미포함)
- **Bimodal lane**: `(a) 값 제공 lane: assistantMessage 30자 + extractedFields 채움 + askFields 다음 슬롯` / `(b) 설명 요청 lane: 2~4문장 + askFields 유지 + extractedFields 비움`. lane 판단은 LLM 자체.
- **RADIO_OPTIONS map**: `Record<path, { value: string; label: string }[]>`. 현재 `application.rightType`만. 신규 enum 필드 추가 시 한 줄 등록.
- **split-id state pair**: `splitIdParts: Record<path, { front, back }>` (UI state) + `splitIdBackRefs: Record<path, RefObject>` (autofocus). 합성값은 `setValue('${front}-${back}')`로 단일 source of truth.
- **fieldType priority**: `split-id → radio → boolean → select → ...`. split-id가 boolean보다 먼저(주민번호의 type='id'가 boolean 우선되면 안 됨).
- **placeholder/help 동등 처리**: `'split-id'`를 `'id'`와 동일 분기로 묶어 안내 문구 재사용.
- **autofocus 트리거**: 앞 input이 6자리(maxLength) 채워지면 `splitIdBackRefs[path].current?.focus()`. 값 합성과 분리된 side-effect.

### CLAUDE.md Updates (이번 사이클)
| Action | Target | 근거 |
|--------|--------|------|
| **ADD** | `PII 위젯 마스킹 정합성` — 분할 입력 위젯 합성값은 `maskRrnInString` 정규식과 1:1 일치 + `isFilled` 부분 제출 차단 + 단일 chokepoint 마스킹 | 코드만 보고 추측 불가(보안 의도). 향후 PII 위젯(여권번호/사업자번호 split 등) 추가 시 반복 적용. "이 줄 없으면 평문 leak 실수" 테스트 통과. 1줄 명료. 기존 umbrella 규칙(server-side 키 보호/server-only)과 보호 영역 다름(PII는 클라 → 서버 history 경로). |

총 1건(ADD 1). MODIFY/DELETE 0. 기각 사유:
- "Bimodal LLM prompt 분기": Gemini 챗봇 1곳 한정 구현 디테일. 다른 LLM 추가 시 재평가. → learn.md only.
- "Zod enum → UI 위젯 옵션 SSoT": land-permit-ai 1곳에서만 활용. 일반 패턴이지만 본 프로젝트 다른 영역(절차형 폼/대시보드)에 반복 가능성 낮음. → learn.md only.
- "FieldDescriptor additive only + legacy 분기 보존": land-permit-ai/components/v2/cards 한정. 일반 마이그레이션 원칙이지만 프로젝트 전반 규칙으로 격상하기엔 너무 추상적. → learn.md only.
- "Bimodal/legacy 분기 패턴" 통합 규칙: 005에서 "askFields"도 land-permit-ai 한정으로 기각한 사유 그대로 적용.

### arch 사후 리뷰 결과
- APPROVE_WITH_NIT.
- High 1: split-id `isFilled` 부분 제출 가능(6자리만 입력 시) → 정규식 매치로 즉시 수정 완료.
- 이외 Critical 0, Medium/Low 없음. 빌드 15/15 통과. 머지 차단 사유 없음.
- 본 spec도 `.beskit/specs/` 트랙 외 직접 진행. 005와 동일하게 정식 사후 리뷰 미수행, 후속 평가 통합.

### 005와의 관계 (제거/변형/유지 메모)
**유지(006에서도 살아있음)**:
- 005의 `askFields` 신호 + 3-tier graceful fallback(`askFields > missingFields ≤ 3 > []`) — 무변경.
- 005의 `AssistantTurnContext.askFields` 전달 흐름 — 무변경.
- 002~004 코어(Gemini API, auto-lookup, route group, 디자인 토큰 격리, share/answer-mapper) — 무변경.

**확장(006에서 추가)**:
- system-prompt 규칙 #4: 단일 lane → bimodal lane(005의 30자 안내 규칙은 값 제공 lane으로 이동, 설명 요청 lane 신설).
- FieldDescriptor.type union에 `'radio' | 'select' | 'split-id'` 3개 additive.
- derive-slots: RADIO_OPTIONS map + fieldType 우선순위 + options 첨부.
- FormCard: splitIdParts/splitIdBackRefs state, handleSplitIdChange, isFilled 정규식 게이트, radio/split-id 렌더 분기.

**변경 없음**:
- backend(`/api/gemini/chat`, `mergeExtractedFields`, `applyAutoLandLookup`, `required-paths`).
- answer-mapper, HTML/PDF/ZIP 빌더, share/encode/decode.
- 디자인 토큰(`.lp-ai-root` scope), route group 구조.
- store/reducer/persist 스키마.

001~005 entry는 historical record로 보존(수정 X).

### Follow-ups (후보 spec)
- **bimodal lane 회귀 테스트**: 고정 질문/답변 시나리오 N개로 LLM이 lane을 정확히 분기하는지 evaluation harness.
- **legacy 'id' 분기 제거**: 외부 호출자 0건 grep 통과 시 `formatRrnInput` + `'id'` 분기 dead path 정리.
- **추가 enum 필드 위젯화**: schemas 추가 시 RADIO_OPTIONS map에 등록. 후보: 매수인/매도인 관계, 거래 유형 등 (현재 enum 후보 부재).
- **select 위젯 실제 활용**: 분기는 추가했으나 현재 등록된 select 필드 0. 향후 옵션 ≥5 enum 등장 시 radio→select 자동 전환 임계값 검토.
- **split-id 일반화**: 사업자번호(3-2-5), 여권번호 등 다른 분할 PII 추가 시 `splitConfig: { partLengths, separator }`로 추상화.
- **`askFields` 화이트리스트 검증(005 follow-up 재확인)**: 006에서 `application.rightType` 신규 필드를 askFields에 LLM이 보낼 때 dot-path 검증 부재. server-side guard 우선순위 ↑.
