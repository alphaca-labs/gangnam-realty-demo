---
id: 002-land-permit-ai-gemini
created: 2026-04-27
type: feat
difficulty: 7
deps: [001-land-permit-ai]
group: G1
status: planning
---

# Spec 002 — `/land-permit-ai` Gemini 자연어 대화 전환

## Overview

001-land-permit-ai에서 도입한 결정 트리(룰 기반) 챗봇을 **완전히 제거**하고, Google Gemini 기반 자연어 대화 어시스턴트로 교체한다. 사용자는 정형화된 질문 시퀀스를 따라가는 대신 자유로운 한국어 메시지로 답하며, LLM이 메시지에서 토지거래허가 신청에 필요한 DTO 필드를 추출(function calling / responseSchema)해 채워나간다.

본 spec은 001을 superseded 하지 않고 **evolution**(deps: [001-land-permit-ai])이다. 001의 자원 중 다음은 그대로 재사용한다:

- `src/data/land-permit.ts` (DTO 타입 SSoT)
- `src/lib/land-permit-html.ts`, `src/lib/zip-generator.ts` (HTML/PDF/ZIP 빌더)
- `src/features/land-permit-ai/share/*` (URL 직렬화/QR)
- `src/features/land-permit-ai/providers/*` (Land/Address Lookup Mock)
- `src/features/land-permit-ai/engine/answer-mapper.ts` (Answers → 7개 form 변환)

다음은 폐기/재작성한다:

- `src/features/land-permit-ai/engine/{ChatEngine,selectors,conditional,validation}.ts`
- `src/features/land-permit-ai/scenarios/*`
- `src/features/land-permit-ai/state/{reducer,actions}.ts` (재작성)
- `src/features/land-permit-ai/components/inputs/*` 일부 (LLM 텍스트 중심 UI로 단순화)

배포 모델은 GitHub Pages 정적 export에서 **일반 Next.js 서버 배포**(Vercel 등)로 전환된다. `next.config`의 `output: 'export'`와 `basePath: '/gangnam-realty-demo'`를 제거하여 API route를 사용 가능하게 만든다. CLAUDE.md의 'Static Export' 규칙은 본 spec 기준으로 land-permit-ai 한정 무효화된다(전역 규칙 변경은 별도 spec).

## Goals

- [ ] `/api/gemini/chat` API route(POST) 추가, `GEMINI_API_KEY` 환경변수 사용, 클라이언트로 키 노출 없음(서버 전용)
- [ ] Gemini function calling / responseSchema 기반으로 사용자 자연어 메시지에서 DTO 필드 추출
- [ ] 4가지 케이스(self-occupy / non-residential / tax-deferral / proxy) 모두 자연어 대화로 완료 가능
- [ ] 사용자가 한 응답에 여러 필드를 한 번에 담아도 정확히 추출됨 (예: "홍길동, 010-1234-5678", "강남구 역삼동 123-45, 100㎡")
- [ ] 모든 필드가 채워지면 미리보기 → 기존 PDF 단일/ZIP 다운로드 → QR 공유가 001과 동일하게 동작
- [ ] 결정 트리 잔재 코드 0건 (engine/scenarios/conditional 모두 제거 완료)
- [ ] `next.config`에서 `output: 'export'`, `basePath` 제거 → Vercel 등 일반 Next.js 배포 가능 형태
- [ ] API 호출 실패/네트워크 에러/키 미설정 시 명확한 한국어 에러 메시지 노출, 키나 내부 스택 leak 없음
- [ ] `npm run build` 통과
- [ ] 기존 `/land-permit` (절차형) 페이지 회귀 없음
- [ ] `.env.example`에 `GEMINI_API_KEY` 안내, 환경변수 설정 방법을 README/관련 파일 인라인 코멘트로 안내

## Non-Goals

- 1-shot agent autonomy (사용자 검증 단계 유지, 모든 필드를 한 번에 LLM이 결정 X)
- 음성/카메라 OCR 입력
- LangChain 등 LLM 프레임워크 도입 (Gemini SDK 직접 호출)
- Gemini 외 LLM 멀티-프로바이더 추상화 (인터페이스화 X)
- 단위 테스트 작성 (데모 정책상 빌드/수동 검증으로 갈음)
- 결제/billing/사용량 제한 처리 (시연용)
- 기존 `/land-permit` (절차형) 페이지 변경
- 다국어(i18n) 지원
- 서버사이드 영속화 (DB/세션) — 여전히 URL 기반 stateless

## Technical Approach

> 모듈 분리, 챗 엔진 내부 구조, JSON Schema 형태, system prompt 세부 문구, 에러 처리 정책 등 **세부 아키텍처는 arch가 별도 수립 중**이다. 본 spec은 **작업 항목과 산출물 단위**만 정의하고, 구체 구현은 arch 결과를 따른다.

작업 항목 수준의 큰 그림만 기술한다:

- LLM 호출은 server-only API route(`/api/gemini/chat`)에서만 수행. 클라이언트는 메시지 히스토리 + 현재 DTO 부분 상태를 POST하고, route는 Gemini 응답(추출된 부분 DTO + 다음 어시스턴트 발화)을 반환
- 추출 전략: Gemini structured output(function calling 또는 responseSchema)으로 DTO 부분 객체를 받음. 스키마는 `src/data/land-permit.ts`의 DTO에서 파생
- 클라이언트 상태: 메시지 히스토리 + 누적 DTO + 진행 케이스. `useReducer` 재작성
- UI: 단일 텍스트 입력 중심(자연어). 빠른 응답 버튼/스텝 폼은 제거. 누락 필드는 LLM이 다음 발화로 자연스럽게 요청
- 미리보기/PDF/ZIP/QR/URL 직렬화는 001의 자산을 그대로 호출 (변경 없음)
- 신규 패키지: Gemini 공식 SDK 1종 (`@google/genai` 또는 `@google/generative-ai` — arch 결정), 선택적으로 `zod` (스키마 검증)
- 배포: `next.config` 정적 export 제거 후 Vercel을 1차 타겟으로 가정. GitHub Pages 배포 워크플로우는 본 spec 범위 외
- 보안: API 키는 server-side env로만, 응답 에러는 사용자 노출용 일반화된 한국어 메시지로 변환

## Dependencies

- 선행 spec: 001-land-permit-ai (자원 재사용, evolution 관계)
- 신규 패키지: Gemini 공식 SDK (`@google/genai` 또는 `@google/generative-ai` — arch 확정), 선택 `zod`
- 재사용 모듈:
  - `src/data/land-permit.ts` (DTO 타입 SSoT — 스키마 파생 원천)
  - `src/lib/land-permit-html.ts`, `src/lib/zip-generator.ts`
  - `src/features/land-permit-ai/share/*` (URL+QR)
  - `src/features/land-permit-ai/providers/*` (Land/Address Lookup Mock)
  - `src/features/land-permit-ai/engine/answer-mapper.ts`
- 환경: `GEMINI_API_KEY` 환경변수 (Vercel 등 호스팅 환경에서 주입)
- arch가 수립할 산출물 (선행 의존):
  - 모듈 분리/레이어링
  - DTO → JSON Schema 변환 전략
  - system prompt 본문
  - function calling 호출 형태/에러 처리 정책

## Reference

- 선행 spec: `.beskit/specs/001-land-permit-ai/{spec.md, todos.md, note.md}`
- 데이터 타입: `src/data/land-permit.ts`
- 모듈 본체: `src/features/land-permit-ai/`
- 변경 대상 설정: `next.config.ts`
- 프로젝트 규칙: `CLAUDE.md` (Static Export 규칙은 본 spec에서 land-permit-ai 한정 무효화)
- 기획서: `SPEC.md`
- 외부: Google Gemini API (Generative AI / GenAI SDK), function calling / responseSchema 기능
