---
id: 001-land-permit-ai
created: 2026-04-27
type: feat
difficulty: 6
deps: []
group: G1
status: planning
---

# Spec 001 — `/land-permit-ai` 챗봇 어시스턴트

## Overview

기존 절차적(스텝 폼) `/land-permit` 페이지와 별개로, 채팅 UI 기반의 토지거래허가 신청서 작성 어시스턴트 `/land-permit-ai`를 신설한다.

사용자는 채팅창에서 한 번에 한 항목씩 답변하며 4가지 케이스(self-occupy / non-residential / tax-deferral / proxy) 중 하나에 필요한 정보를 모두 수집받고, 완료 시 미리보기 → PDF/ZIP 다운로드 → QR 내보내기를 동일 UI 내에서 수행할 수 있다.

데이터 타입(`src/data/land-permit.ts`), HTML/PDF 빌더(`src/lib/land-permit-html.ts`), ZIP 묶음(`src/lib/zip-generator.ts`)은 재사용한다. 신규 모듈은 `src/features/land-permit-ai/*` 하위에 위치하여 추후 별도 웹 서비스로 떼어내기 쉬운 구조로 작성한다.

## Goals

- [ ] `/land-permit-ai` 라우트가 추가되어 ChatGPT 스타일 채팅 UI로 진입 가능
- [ ] 4가지 케이스(self-occupy / non-residential / tax-deferral / proxy) 모두 챗봇 플로우로 입력 완료 가능
- [ ] 한 번에 하나의 질문만 노출되며, 사용자 응답 후 다음 질문이 자연스럽게 이어짐
- [ ] 모든 항목 입력 완료 시 채팅 흐름 안에서 최종 미리보기(읽기 전용)가 노출됨
- [ ] 미리보기 화면에서 기존 PDF 단일/ZIP 다운로드를 그대로 사용 가능
- [ ] 사용자 입력값이 URL(쿼리 파라미터/해시)에 직렬화되고, 해당 URL을 QR로 내보낼 수 있음 (서버 저장 없음)
- [ ] QR 코드 다운로드(PNG) 또는 표시가 가능
- [ ] 주소 입력 시 `LandLookupProvider` 인터페이스를 통해 지번/면적/용도를 조회하여 후속 질문을 자동으로 채우거나 사용자 확인을 받음
- [ ] 기본은 Mock Provider로 동작하며, 실 API Provider(카카오/VWorld 키 기반)를 환경변수로 주입 가능
- [ ] 사이드바 메뉴에 "토지거래허가 (AI 챗봇)" 항목이 추가되어 라우팅 동작
- [ ] `npm run build`(Next.js 15 static export) 성공
- [ ] `next.config` `output: 'export'`/`basePath: '/gangnam-realty-demo'` 환경에서 라우트 및 정적 자산 정상 동작

## Non-Goals

- 기존 `/land-permit` 페이지·플로우 수정 또는 제거 (그대로 유지)
- 데이터 타입/HTML 빌더/ZIP 빌더 재작성 — 기존 파일을 그대로 import 하여 사용
- 서버사이드 영속화 (DB 저장, 사용자 계정, 세션) — URL 기반 stateless만 지원
- 챗봇에 LLM/외부 NLP 모델 연동 — 결정 트리/룰 기반으로만 진행
- 모바일 카메라 OCR, 음성 입력 등 부가 입력 수단
- 위임장 외 추가 케이스 신설
- 다국어(i18n) 지원
- 단위 테스트 작성 (데모 프로젝트 정책상 빌드 검증으로 갈음)

## Technical Approach

> 세부 디렉토리 구조와 챗봇 엔진 내부 설계는 arch가 별도 수립 중. 본 spec은 **작업 항목과 산출물 단위**만 정의하고, 구체 모듈 분할은 arch 결과를 따른다.

- 위치: 모든 신규 코드는 `src/features/land-permit-ai/*` 하위에 작성
- 진입점: `src/app/land-permit-ai/page.tsx` (얇은 래퍼, 실제 로직은 features에서 import)
- 상태 관리: 페이지 로컬 상태 (React `useState` / `useReducer`) — 외부 라이브러리 추가 없음
- 챗봇 엔진: 결정 트리 기반. 케이스 선택 → 케이스별 질문 시퀀스 → 검증 → 미리보기
- 주소 조회 추상화: `LandLookupProvider` 인터페이스 + `MockLandLookupProvider` 기본 구현. 실 API 구현은 동일 인터페이스 준수
- URL 직렬화: 입력값을 base64(JSON) 또는 URLSearchParams 형태로 인코딩하여 `/land-permit-ai?d=...` 형태로 복원 가능
- QR: `qrcode.react` 신규 설치, 클라이언트 컴포넌트로 캔버스 렌더링 후 PNG 다운로드 지원
- 출력 파일 생성: `src/lib/land-permit-html.ts` + `src/lib/zip-generator.ts` 그대로 호출
- 'No API calls' 규칙 예외: `land-permit-ai` 모듈에 한해 외부 주소 API 사용 가능. 기본은 Mock으로 빌드 시 외부 의존 없음을 보장

## Dependencies

- 신규 패키지: `qrcode.react`
- 재사용 모듈:
  - `src/data/land-permit.ts` — 타입/케이스 정의
  - `src/lib/land-permit-html.ts` — HTML/PDF 빌더
  - `src/lib/zip-generator.ts` — ZIP 묶음 생성
- 기존 라우팅 시스템: `src/app/*` (App Router)
- 사이드바 컴포넌트(기존 레이아웃) — 메뉴 추가 위치
- arch가 수립할 모듈 디렉토리 구조 및 챗봇 엔진 인터페이스 (선행 의존)

## Reference

- 기존 절차적 페이지: `src/app/land-permit/page.tsx`
- 기존 데이터 모델: `src/data/land-permit.ts`
- 기존 HTML 빌더: `src/lib/land-permit-html.ts`
- 기존 ZIP 빌더: `src/lib/zip-generator.ts`
- 프로젝트 규칙: `CLAUDE.md`, `SPEC.md`
- 외부 라이브러리: `qrcode.react`, (선택) Kakao Address API, VWorld API
