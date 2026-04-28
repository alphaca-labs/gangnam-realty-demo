# Todos — 001 land-permit-ai

> 병렬 그룹(Group)별로 묶어 동시 실행. 같은 그룹 내 [P] 태그 작업은 서로 독립적으로 병렬 가능.
> 각 TODO는 1-2시간 내 완료를 목표로 분해됨.

## Phase Layout

- **G1 — Foundation (의존성 없음, 모두 병렬)**
- **G2 — Core 구현 (G1 완료 후, 내부 병렬 가능)**
- **G3 — Integration (G2 완료 후)**
- **G4 — Build/Verify (마지막)**

## Tasks

| ID    | Task                                                                                                          | Status | Deps          | Group |
| ----- | ------------------------------------------------------------------------------------------------------------- | ------ | ------------- | ----- |
| T-001 | [P] `qrcode.react` 패키지 설치 및 `package.json`/`package-lock.json` 반영                                     | ⏳     | -             | G1    |
| T-002 | [P] `src/features/land-permit-ai/` 모듈 디렉토리 생성 (arch 결정 구조 반영, `index.ts` placeholder 포함)      | ⏳     | -             | G1    |
| T-003 | [P] `LandLookupProvider` 인터페이스 정의 (입력: 도로명/지번 주소, 출력: 지번/면적/지목/용도지역) 및 타입 export | ⏳     | -             | G1    |
| T-004 | [P] 챗봇 시나리오 데이터 정의: 4 케이스별 질문 시퀀스/필드 매핑/검증 규칙 (정적 데이터)                       | ⏳     | -             | G1    |
| T-005 | [P] 챗봇 메시지/세션 도메인 타입 정의 (Message, ChatTurn, FormSnapshot 등)                                    | ⏳     | -             | G1    |
| T-006 | [P] 사이드바 메뉴 항목 entry 정의 위치 식별 및 "토지거래허가 (AI 챗봇)" 메뉴 추가 (라우트 `/land-permit-ai`)   | ⏳     | -             | G1    |
| T-010 | 챗봇 엔진 구현: 시나리오 기반 다음 질문 산출 / 응답 검증 / 진행률 계산 함수                                   | ⏳     | T-004,T-005   | G2    |
| T-011 | `MockLandLookupProvider` 구현: 하드코딩 주소 → 지번/면적/용도 응답, 비동기 시뮬레이션                          | ⏳     | T-003         | G2    |
| T-012 | (선택) 카카오/VWorld 기반 실 API Provider skeleton 구현 (env 키 없을 때 Mock fallback)                         | ⏳     | T-003,T-011   | G2    |
| T-013 | URL 직렬화 유틸 구현: form snapshot ↔ URL query 양방향 인코딩/디코딩 (base64+JSON 또는 압축)                  | ⏳     | T-005         | G2    |
| T-014 | 채팅 UI 컴포넌트 구현: 메시지 리스트, 입력창, 빠른 응답 버튼, 진행률 표시 (ChatGPT 스타일)                    | ⏳     | T-005         | G2    |
| T-015 | 미리보기 컴포넌트 구현: 케이스별 문서 카드 + 기존 `land-permit-html` 호출 hook                                | ⏳     | T-004,T-005   | G2    |
| T-016 | QR 컴포넌트 구현: `qrcode.react` 사용, URL 입력 → 캔버스 렌더 + PNG 다운로드 버튼                             | ⏳     | T-001,T-013   | G2    |
| T-020 | `/land-permit-ai/page.tsx` 라우트 페이지 작성: features 모듈 wiring (엔진+UI+Provider 주입)                   | ⏳     | T-010,T-014   | G3    |
| T-021 | URL 파라미터 자동 복원 로직 통합: 진입 시 `?d=...` 디코딩하여 챗봇 상태 복구                                  | ⏳     | T-013,T-020   | G3    |
| T-022 | 미리보기 → PDF 단일 / ZIP 다운로드 버튼 통합 (기존 `land-permit-html`, `zip-generator` 사용)                  | ⏳     | T-015,T-020   | G3    |
| T-023 | 미리보기 → QR 내보내기 통합: 현재 입력 상태를 URL로 직렬화 후 QR 컴포넌트에 전달                              | ⏳     | T-016,T-022   | G3    |
| T-024 | 주소 자동 조회 통합: 주소 응답 시 Provider 호출 → 후속 질문 자동 채움 + 사용자 확인 메시지                    | ⏳     | T-010,T-011,T-020 | G3 |
| T-025 | 사이드바 메뉴 라우팅 동작 검증 및 페이지 이동 테스트 (수동)                                                   | ⏳     | T-006,T-020   | G3    |
| T-030 | `npm run build` 통과 확인 (static export, basePath 적용 상태)                                                | ⏳     | T-020..T-025  | G4    |
| T-031 | 4 케이스 시나리오 수동 흐름 검증 + QR/PDF/ZIP 산출물 확인                                                    | ⏳     | T-030         | G4    |
| T-032 | 기존 `/land-permit` 페이지가 영향 없이 그대로 동작하는지 회귀 확인                                            | ⏳     | T-030         | G4    |

## Status Legend

- ⏳ Pending
- 🔄 Active
- ✅ Done
- ⛔ Blocked

## Parallelization Notes

- G1: T-001 ~ T-006 모두 병렬 가능 (서로 파일/의존 충돌 없음)
- G2: T-010~T-016 중
  - T-011/T-012는 T-003 위에서 병렬
  - T-013/T-014는 T-005 위에서 병렬
  - T-015는 T-004,T-005, T-016은 T-001,T-013 — 의존만 충족되면 동시 진행 가능
- G3: T-020 선행 후 T-021~T-025는 가급적 직렬 통합 (페이지 파일 충돌 회피)
- G4: 빌드/회귀는 직렬
