---
id: 003-auto-land-lookup
created: 2026-04-27
type: feat
difficulty: 5
deps: [002-land-permit-ai-gemini]
group: G1
status: planning
---

# Spec 003 — 자동 토지 정보 조회 (Kakao + VWorld)

## Overview

002(Gemini 자연어 대화)에서 사용자가 토지 주소(도로명/지번)와 지번을 입력하면, 서버가 자동으로 외부 공공 API를 호출해 **지목/면적/용도지역**을 조회하고 누적 DTO(mergedAnswers) 및 후속 LLM 컨텍스트에 자동 반영한다. 사용자가 수기로 답할 필요가 없어지고, LLM은 검증된 토지 메타데이터를 근거로 후속 질문/요약을 생성할 수 있다.

조회 파이프라인은 두 단계로 구성된다.

1. **Kakao Local API** — 자연어 주소를 정규화/지오코딩하여 좌표/법정동 정보 확보
2. **VWorld API** — 좌표 또는 PNU(필지고유번호)로 토지이용계획 조회 → 지목/면적/용도지역 추출

본 spec은 002의 evolution이며, 002에서 이미 존재하는 `LandLookupProvider` / `AddressLookupProvider` 인터페이스와 `providers/{vworld,kakao,mock}-*.ts` skeleton을 채워넣는 작업이다. 인터페이스 자체는 보존한다. arch가 트리거 조건/호출 순서/응답 스키마 확장(autoLookup metadata)을 동시에 수립 중이며, 본 spec은 작업 항목 단위만 정의한다.

키 미설정 환경에서도 데모가 정상 동작해야 하므로 **Mock provider fallback**을 유지한다. 외부 API 실패 시에도 사용자 흐름이 끊기지 않고, 직접 입력 안내로 자연스럽게 전환된다.

## Goals

- [ ] 사용자가 토지 주소 + 지번을 입력하면 서버에서 자동으로 Kakao + VWorld API 호출
- [ ] 응답된 지목/면적/용도지역이 mergedAnswers 및 후속 LLM 컨텍스트에 자동 반영
- [ ] `VWORLD_API_KEY` / `KAKAO_REST_API_KEY` 둘 중 하나라도 미설정 시 Mock provider로 자연스러운 fallback
- [ ] 외부 API 실패(timeout, 4xx/5xx, 빈 응답)에도 사용자 흐름이 끊기지 않음 (직접 입력 안내로 전환)
- [ ] 동일 주소+지번 조합은 메모리 LRU 캐시(짧은 TTL)로 중복 호출 회피
- [ ] API 키는 클라이언트 번들/응답에 절대 노출 금지 (server-only env)
- [ ] `/api/gemini/chat` 응답 스키마 확장(autoLookup metadata)이 클라이언트와 호환
- [ ] `npm run build` 통과
- [ ] 기존 002 흐름 회귀 없음 (키 미설정 시에도 Gemini 응답 동작)

## Non-Goals

- 강남구 외 주소에 대한 매핑 정확도 보장 (데모 우선, 강남구 위주 검증)
- 복수 후보 주소 disambiguation UI (가장 유사한 첫 번째 후보 채택)
- 좌표/지도 시각화 (지도 페이지/마커 노출 없음)
- 클라이언트에서 직접 외부 API 호출 (브라우저 → Kakao/VWorld 직접 호출 금지)
- 별도 서버 프록시 인프라 (Next.js API route로 충분, 외부 게이트웨이 도입 X)
- 캐시 영속화 (메모리 only, 재시작 시 비움)
- 단위 테스트 작성 (데모 정책상 빌드/수동 검증으로 갈음)
- VWorld 토지대장/등기부 등 추가 데이터 (지목/면적/용도지역 3종만)
- API 사용량/billing 모니터링

## Technical Approach

> 트리거 조건(어느 시점에 lookup을 실행할지), 호출 순서(Gemini 응답 전/후), 응답 스키마 확장(autoLookup metadata 포맷), Kakao/VWorld 응답에서 어떤 필드를 어떻게 매핑할지 등 **세부 정책은 arch가 별도 수립 중**이다. 본 spec은 작업 항목과 산출물 단위만 정의한다.

작업 항목 수준의 큰 그림:

- 외부 API 호출은 **server-only**(`/api/gemini/chat` route 내부 또는 동일 process server module)에서만 수행. 환경변수: `VWORLD_API_KEY`, `KAKAO_REST_API_KEY`
- 002의 `KakaoAddressLookupProvider` / `VWorldLandLookupProvider` skeleton에 실제 fetch 로직을 채운다. 인터페이스 시그니처는 보존
- orchestrator 모듈: 입력(주소+지번)을 받아 (1) Kakao로 좌표/법정동 정규화 → (2) VWorld로 PNU 또는 좌표 기반 토지이용계획 조회 → 부분 결과(지목/면적/용도지역) 반환. 어느 한 단계 실패해도 다른 단계 결과는 보존
- 트리거 판정: arch가 정의할 조건(예: 누적 DTO에 주소+지번이 모두 채워졌고, 지목/면적/용도지역 중 미채워진 항목이 있는 경우)에 따라 orchestrator 호출
- 캐시: 메모리 LRU(키=`${normalizedAddress}|${jibun}`, 짧은 TTL). 캐시 hit 시 외부 API 호출 skip
- Mock fallback: 키가 하나라도 없으면 기존 mock provider로 동작. 응답에 `source: 'mock'` metadata 포함
- 에러 처리: 4xx(키 오류, quota), 5xx, timeout, 빈 응답 모두 catch → orchestrator는 부분 결과 또는 빈 결과 반환, 사용자에게는 "자동 조회 실패, 직접 입력 부탁드립니다" 한국어 안내
- 응답 스키마 확장: `/api/gemini/chat` 응답에 `autoLookup`(조회 시도 여부, source, 결과, 실패 사유) metadata 추가. arch가 정확한 schema 결정. 클라이언트는 호환되는 형태로 표시 (선택)
- 보안: API 키는 server-side env로만 접근. fetch 호출은 server module에서만. 클라이언트 번들/응답 본문 어디에도 키 leak 금지

## Dependencies

- 선행 spec: 002-land-permit-ai-gemini (API route, providers 인터페이스, mock 구현)
- 보존 인터페이스:
  - `src/features/land-permit-ai/types/providers.ts` (`LandLookupProvider`, `AddressLookupProvider`)
- 채워넣을 skeleton:
  - `src/features/land-permit-ai/providers/kakao-*.ts`
  - `src/features/land-permit-ai/providers/vworld-*.ts`
- 보존(변경 없음):
  - `src/features/land-permit-ai/providers/mock-*.ts` (fallback로 그대로 사용)
  - `src/data/land-permit.ts` (DTO SSoT)
- 신규 환경변수: `VWORLD_API_KEY`, `KAKAO_REST_API_KEY` (server-only)
- 외부:
  - Kakao Local API (REST) — 주소 검색/좌표 변환
  - VWorld API — 토지이용계획/필지 정보
- arch가 수립할 산출물 (선행 의존):
  - 트리거 조건 정의
  - Gemini 응답 전/후 호출 순서
  - 응답 스키마 확장(autoLookup metadata) 포맷
  - 캐시 TTL/사이즈 결정
  - 부분 결과 처리 정책

## Reference

- 선행 spec: `.beskit/specs/002-land-permit-ai-gemini/{spec.md, todos.md, note.md}`
- API route: `src/app/api/gemini/chat/route.ts`
- providers: `src/features/land-permit-ai/providers/`
- 인터페이스: `src/features/land-permit-ai/types/providers.ts`
- DTO: `src/data/land-permit.ts`
- 프로젝트 규칙: `CLAUDE.md` (server-side LLM key 보호 규칙은 VWORLD/KAKAO에도 동일 적용)
- 외부:
  - Kakao Local API (REST, `kapi.kakao.com/v2/local/...`)
  - VWorld API (`api.vworld.kr/...`, 토지이용계획 / 필지 / PNU 조회)
