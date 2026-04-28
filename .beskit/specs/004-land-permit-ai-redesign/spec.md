---
id: 004-land-permit-ai-redesign
created: 2026-04-27
type: feat
difficulty: 7
deps: [002-land-permit-ai-gemini, 003-auto-land-lookup]
group: G1
status: planning
---

# Spec 004 — 토지거래허가 AI 독립 레이아웃 + 디자인 전면 개편

## Overview

002(Gemini 자연어 대화)와 003(자동 토지 조회)으로 백엔드는 안정화되었으나, 현재 `/land-permit-ai` 페이지는 gangnam-realty-demo의 공용 사이드바/레이아웃에 묶여있고 UI 또한 일반 채팅 버블 수준에 머물러 있다. 본 spec은 같은 repo 내에서 `/land-permit-ai/*` 라우트를 **자체 레이아웃(공용 Sidebar 비노출)**으로 분리하고, 첨부 디자인 패키지(`/tmp/design-package/gangnam/`)의 토큰/컴포넌트 시스템을 적용해 **디자인을 전면 개편**한다.

핵심은 멀티턴 대화 UX와 "응답 포맷의 다양화"다. 챗봇 응답을 단일 텍스트 버블이 아닌, 컨텍스트에 따라 6종 리치 카드(FormCard, ParcelCard, StepCard, SummaryTable, ChoiceCard, AIText)로 렌더링한다. 003의 autoLookup 결과는 ParcelCard(미니맵 포함)로, 진행률은 StepCard로, 누적 답변 요약은 SummaryTable로, 케이스 분기는 ChoiceCard로, 사용자 입력 폼이 필요한 단계는 FormCard로 표현한다.

백엔드(Gemini API route, auto-lookup, providers, schema/share/answer-mapper, DTO)는 **재사용**한다. 변경은 프런트엔드 레이아웃/디자인 시스템/메시지 렌더링 파이프라인에 한정된다.

arch가 동시에 정확한 라우트 그룹 경로, 카드 분기 정책, 디자인 패키지 컴포넌트 → React 매핑 규칙을 수립 중이다. 본 spec은 작업 항목과 산출물 단위만 정의한다.

## Goals

- [ ] `/land-permit-ai/*` 라우트가 자체 레이아웃을 가지며 gangnam 공용 Sidebar가 보이지 않음
- [ ] 디자인 패키지의 토큰 시스템(OKLCH paper background, GN Deep Blue rgb(20,65,150), Pretendard/Gowun Batang/JetBrains Mono)이 `/land-permit-ai/*` 범위에 적용됨
- [ ] AIBubble, UserBubble, AIText 기본 버블 + RichCard 6타입(FormCard, ParcelCard, StepCard, SummaryTable, ChoiceCard, AIText)이 모두 React 컴포넌트로 구현됨
- [ ] 챗봇 응답이 컨텍스트에 따라 적절한 리치 카드 타입으로 렌더링됨 (autoLookup → ParcelCard, 진행률 → StepCard, 완료/요약 → SummaryTable, 케이스 선택 → ChoiceCard, 입력 폼 → FormCard, 일반 텍스트 → AIText)
- [ ] 멀티턴 대화 UX 구성 요소 모두 구현: 자체 Sidebar(최근 상담 mock), Composer(suggestions 포함), NoticeBanner, ChatHeader
- [ ] 모바일 반응형(~768px breakpoint): Sidebar 숨김 + 단순 헤더 + 적응형 패딩
- [ ] MapPanel(필지 시각화 SVG) 또는 인라인 ParcelCard로 필지 미니맵 통합
- [ ] ResultReport(검토 리포트 화면) 통합 — 별도 라우트 또는 대화 종료 단계
- [ ] 기존 Gemini API/auto-lookup/Provider/Schema/share/answer-mapper 재사용 (수정 0 또는 최소)
- [ ] PII 마스킹(주민번호) 유지
- [ ] 002 결정 트리 잔재 0 유지 (`engine/ChatEngine`, `scenarios/*`, `selectors`, `conditional` 부재 재확인)
- [ ] `npm run build` 통과
- [ ] 다른 라우트 회귀 없음 (`/`, `/calculator`, `/civil`, `/land-permit`, `/ai-compare`, `/contract`, `/checklist`, `/business-registration`, `/employment`, `/examples`, `/map`, `/prices`)

## Non-Goals

- 별도 git repo 분리 (현재 same-repo 유지)
- iOS 모바일 프레임 구현 (반응형 웹만)
- multi-session backend (현재 localStorage 1세션, 사이드바는 mock 데이터)
- 디자인 패키지의 design-canvas / tweaks-panel / ios-frame 자체 구현
- 새 LLM 모델 도입 (Gemini 유지)
- 단위 테스트 작성 (데모 정책상 빌드/수동 검증으로 갈음)
- 다국어 (한국어 단일)
- `/land-permit` (절차형) 페이지 변경
- 002/003의 백엔드 로직 재작성 (재사용 범위)

## Technical Approach

> 라우트 그룹의 정확한 경로, 카드 타입 분기 트리거, 디자인 패키지 JSX → React 매핑 규칙(props/이벤트/상태 위치) 등 **세부 정책은 arch가 별도 수립 중**이다. 본 spec은 작업 항목과 산출물 단위만 정의한다.

작업 항목 수준의 큰 그림:

- **라우트 격리**: Next.js App Router의 route group 또는 nested layout으로 `/land-permit-ai/*`만 별도 layout. 공용 Sidebar 컴포넌트가 mount되지 않음
- **스타일 격리**: 디자인 패키지의 `styles.css` 토큰을 land-permit-ai scope로 도입 (전역 globals.css에 leak 금지). 폰트(Pretendard/Gowun Batang/JetBrains Mono)는 패키지 정책에 따라 CDN 또는 next/font로 로드
- **컴포넌트 매핑**: 디자인 패키지의 `chat-components.jsx` / `chat-screens.jsx` / `extra-screens.jsx`를 React+TS 컴포넌트로 변환. 위치는 `src/features/land-permit-ai/components/` 하위 새 디렉토리 (arch 결정 경로). 기존 컴포넌트는 단계적 교체
- **메시지 타입 확장**: 기존 메시지 model을 `{ kind: 'ai-text' | 'user-text' | 'form' | 'parcel' | 'step' | 'summary' | 'choice', payload: ... }` 형태로 확장. reducer/state는 002 구조 보존, payload만 다양화
- **카드 분기**: API 응답에서 받은 데이터(answers/missingFields/isComplete/autoLookup/caseType 등)를 카드 타입으로 매핑. arch 결정안 적용
- **백엔드 재사용**: `/api/gemini/chat`, `llm/auto-lookup.ts`, `providers/*`, `share/*`, `state/answer-mapper`, `data/land-permit.ts` 모두 그대로. 응답 schema가 부족하면 최소 metadata 추가만 (가능하면 0 수정)
- **MapPanel/ResultReport**: 필지 시각화는 인라인 ParcelCard 또는 별도 MapPanel 컴포넌트로 통합. 검토 리포트(ResultReport)는 대화 완료 후 노출 (별도 라우트 또는 단계, arch 결정)
- **모바일 반응형**: Tailwind breakpoint(~768px)로 Sidebar 숨김, 단순 헤더 전환, 패딩 적응
- **PII 마스킹 검증**: 002에서 적용된 주민번호 마스킹이 새 카드 렌더링 경로에서도 동일하게 동작
- **회귀 가드**: 다른 라우트(`/`, `/calculator` 등)가 새 토큰/폰트 영향을 받지 않음을 빌드/수동 확인. 002 결정 트리 잔재(`scenarios|conditional|selectors|ChatEngine`)는 0 유지

## Dependencies

- 선행 spec: 002-land-permit-ai-gemini (Gemini API route, providers 인터페이스, 메시지 reducer, share/answer-mapper)
- 선행 spec: 003-auto-land-lookup (autoLookup metadata, Kakao/VWorld provider, 캐시)
- 보존(변경 0 목표):
  - `src/app/api/gemini/chat/route.ts`
  - `src/features/land-permit-ai/llm/auto-lookup.ts` 및 `llm/lookup/*`
  - `src/features/land-permit-ai/providers/*`
  - `src/features/land-permit-ai/types/providers.ts`
  - `src/features/land-permit-ai/share/*`
  - `src/features/land-permit-ai/state/answer-mapper*`
  - `src/data/land-permit.ts` (DTO SSoT)
- 변경(레이아웃/디자인 영역):
  - `src/app/land-permit-ai/page.tsx` 또는 nested layout 추가
  - `src/features/land-permit-ai/components/*` (구 ChatRoot 및 부속 — 단계적 교체)
- 외부:
  - 디자인 패키지: `/tmp/design-package/gangnam/`
    - `styles.css`, `chat-components.jsx`, `chat-screens.jsx`, `extra-screens.jsx`
  - 폰트: Pretendard, Gowun Batang, JetBrains Mono (CDN or next/font)
- arch 선행 산출물:
  - 라우트 그룹/레이아웃 정확한 디렉토리 결정
  - 카드 타입 분기 정책 (어떤 응답 → 어떤 카드)
  - 컴포넌트 매핑(JSX → React+TS) 규칙
  - 스타일 격리 전략(globals.css 영향 최소화)

## Reference

- 선행 spec: `.beskit/specs/002-land-permit-ai-gemini/{spec.md, todos.md, note.md}`
- 선행 spec: `.beskit/specs/003-auto-land-lookup/{spec.md, todos.md, note.md}`
- 디자인 패키지: `/tmp/design-package/gangnam/` (styles.css / chat-components.jsx / chat-screens.jsx / extra-screens.jsx)
- 현재 page: `src/app/land-permit-ai/page.tsx`
- 현재 feature: `src/features/land-permit-ai/{components, engine, llm, providers, share, state, types, utils, index.ts}`
- root layout: `src/app/layout.tsx`
- 전역 스타일: `src/app/globals.css`
- 프로젝트 규칙: `CLAUDE.md`
