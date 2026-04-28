# Todos — 003 auto-land-lookup

> 병렬 그룹(Group)별로 묶어 동시 실행. 같은 그룹 내 [P] 태그 작업은 서로 독립적으로 병렬 가능.
> 각 TODO는 1-2시간 내 완료를 목표로 분해됨.
> 트리거 조건/호출 순서/응답 스키마 확장(autoLookup metadata) 등 세부 정책은 arch 결과를 참조하여 구현한다.

## Phase Layout

- **G1 — Foundation (의존성 없음, 모두 병렬)**
- **G2 — Core 구현 (G1 완료 후, 내부 병렬 가능)**
- **G3 — Integration (G2 완료 후)**
- **G4 — Build/Verify (마지막)**

## Tasks

| ID    | Task                                                                                                                          | Status | Deps              | Group |
| ----- | ----------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------- | ----- |
| T-101 | [P] `.env.example`에 `VWORLD_API_KEY`, `KAKAO_REST_API_KEY` 추가 + 인라인 코멘트로 server-only/미설정 시 mock fallback 안내   | ✅     | -                 | G1    |
| T-102 | [P] VWorld 응답 타입 정의 (토지이용계획/필지 응답에서 사용하는 필드만 — 지목/면적/용도지역 + PNU/좌표 매핑 부분)               | ✅     | -                 | G1    |
| T-103 | [P] Kakao Local API 응답 타입 정의 (주소 검색 결과: 좌표, 법정동, 도로명/지번 정규화 필드)                                   | ✅     | -                 | G1    |
| T-104 | [P] 메모리 LRU 캐시 유틸 작성 (`server-only`, 키=`${normalizedAddress}|${jibun}`, TTL/maxSize는 arch 결정값 적용, 재시작 시 휘발) | ✅     | -                 | G1    |
| T-105 | [P] server-only auto-lookup 모듈 디렉토리/뼈대 생성 (예: `src/features/land-permit-ai/server/auto-lookup/`), `import 'server-only'` 가드 포함 | ✅     | -                 | G1    |
| T-201 | KakaoAddressLookupProvider 실 구현 — skeleton에 fetch(`KAKAO_REST_API_KEY` Authorization 헤더), 응답 파싱(좌표/법정동/정규화), 에러/timeout 처리 | ✅     | T-103,T-105       | G2    |
| T-202 | VWorldLandLookupProvider 실 구현 — PNU 또는 좌표 기반 토지이용계획 조회(`VWORLD_API_KEY` query/header), 지목/면적/용도지역 필드 추출, 에러/timeout 처리 | ✅     | T-102,T-105       | G2    |
| T-203 | auto-lookup orchestrator 구현 — 트리거 판정(arch 정의된 조건) + Kakao→VWorld 직렬 호출 + 부분 결과 처리 + 캐시 활용 + 키 누락 시 mock fallback | ✅     | T-104,T-105,T-201,T-202 | G2 |
| T-301 | `/api/gemini/chat/route.ts`에 auto-lookup hook 삽입 (호출 순서는 arch 결정안 적용 — Gemini 응답 전/후 중 하나)                | ✅     | T-203             | G3    |
| T-302 | `/api/gemini/chat` 응답 스키마 확장 — `autoLookup` metadata 필드 추가(시도 여부, source: real/mock, 조회 결과, 실패 사유), 002 클라이언트와 호환 유지 | ✅     | T-301             | G3    |
| T-303 | system prompt / LLM 컨텍스트에 자동 조회 결과 주입 — 누적 DTO에 머지된 지목/면적/용도지역을 LLM이 알 수 있도록 컨텍스트 구성  | ✅     | T-301             | G3    |
| T-304 | (선택) 클라이언트가 `autoLookup` metadata를 활용해 "자동 조회됨/조회 실패, 직접 입력 부탁드립니다" 인디케이터 표시 — UI 최소 변경 | ✅     | T-302             | G3    |
| T-401 | `npm run build` 통과 확인                                                                                                     | ✅     | T-301..T-304      | G4    |
| T-402 | 키 미설정 fallback 검증 — `VWORLD_API_KEY`/`KAKAO_REST_API_KEY` 둘 중 하나/모두 없을 때 mock provider로 자연스럽게 동작 확인  | ✅     | T-401             | G4    |
| T-403 | 기존 002 흐름 회귀 grep — 4 케이스(self-occupy / non-residential / tax-deferral / proxy) 자연어 흐름이 키 없이도 정상 동작 확인 + `note.md` 작성 | ✅     | T-401             | G4    |
| T-404 | 결정 트리 잔재 0 유지 검증 — `engine/{ChatEngine,selectors,conditional,validation}`, `scenarios/*` grep으로 부재 재확인        | ✅     | T-401             | G4    |

## Status Legend

- ✅ Pending
- 🔄 Active
- ✅ Done
- ⛔ Blocked

## Parallelization Notes

- G1: T-101 ~ T-105 모두 병렬 가능 — 환경변수/타입/캐시 유틸/디렉토리 생성은 파일이 분리되어 충돌 없음.
- G2:
  - T-201 (Kakao)와 T-202 (VWorld)는 서로 다른 provider 파일이라 병렬 가능
  - T-203 (orchestrator)은 T-201+T-202+T-104(캐시)+T-105(디렉토리) 결합 후 진행
- G3:
  - T-301은 단독 선행 (route 파일 충돌 회피)
  - T-302는 T-301 위에서 응답 스키마 확장
  - T-303은 T-301 위에서 prompt/컨텍스트 갱신 (T-302와 병렬 가능 — 다른 모듈)
  - T-304는 T-302 의존, 클라이언트 측 변경이라 T-303과 병렬 가능
- G4: 빌드/회귀/grep은 직렬.

## 신규 추가 파일 (예상)

- `src/features/land-permit-ai/server/auto-lookup/` (디렉토리)
  - orchestrator 모듈
  - 캐시 유틸
  - server-only 가드
- `src/features/land-permit-ai/types/` 하위 또는 동등 위치의 Kakao/VWorld 응답 타입 정의 파일
- `.env.example` 갱신

## 변경 대상 파일

- `src/features/land-permit-ai/providers/kakao-*.ts` (skeleton → 실 fetch)
- `src/features/land-permit-ai/providers/vworld-*.ts` (skeleton → 실 fetch)
- `src/app/api/gemini/chat/route.ts` (lookup hook + 응답 스키마 확장 + prompt/컨텍스트 주입)
- `.env.example`

## 보존 대상 파일 (변경 금지)

- `src/features/land-permit-ai/types/providers.ts` (`LandLookupProvider`, `AddressLookupProvider` 인터페이스 시그니처)
- `src/features/land-permit-ai/providers/mock-*.ts` (fallback 그대로 사용)
- `src/data/land-permit.ts` (DTO SSoT)
- 002의 클라이언트 reducer/UI (autoLookup metadata는 선택적 활용)
