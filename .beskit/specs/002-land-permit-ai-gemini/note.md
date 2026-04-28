# Note — 002 land-permit-ai-gemini

## Findings

- [x] **Zod 4가 자체적으로 `z.toJSONSchema()` 제공** — `zod-to-json-schema` 외부 패키지는 zod 4 인스턴스의 internal 시그니처가 다르기 때문에 타입 호환되지 않음(`ZodType` 호환 실패 컴파일 에러). zod 4 환경에서는 무조건 built-in `z.toJSONSchema(schema, { target: 'draft-7' })`만 사용한다. (CLAUDE.md/팀 공통 노트에 반영 후보)
- [x] **`@google/genai` v1.50+은 `responseJsonSchema` config 필드를 지원** — Zod로 만든 JSON Schema를 그대로 넘길 수 있어 별도 어댑터 변환이 불필요. `responseSchema`(Type.OBJECT 기반 SchemaUnion)는 OpenAPI subset이고 `responseJsonSchema`가 더 표준 JSON Schema에 가깝다. 단, 두 필드 동시 지정 금지. `responseMimeType: 'application/json'` 필수.
- [ ] `@google/genai`의 `Content.role`은 `'user' | 'model'`만 사용. OpenAI 스타일 `'assistant'`를 그대로 보내면 안 됨 → 클라이언트 history(`'user'|'assistant'`)를 서버에서 `'model'`로 변환 필요.
- [ ] `next.config.ts`에서 `output: 'export'` + `basePath` 제거 시 코드 내 하드코딩된 이미지/링크 (`/gangnam-realty-demo/...`)가 깨짐 → src에서 grep으로 모두 제거(현재는 Sidebar 1곳, app/page.tsx 1곳만 있었음).
- [ ] `Image src="/gangnam-realty-demo/gangnam-logo.png"` → `/gangnam-logo.png`로 변경.
- [ ] `public/v2/` 하위 stale static export 결과물이 84개 파일로 남아있음 — 빌드와 무관하지만 정리 후보(별도 spec).
- [ ] `next.config.ts`에 `turbopack.root` 미설정으로 인한 root 추론 경고 발생 → 무해하지만 추후 명시 권장.

## Decisions

- **JSON Schema 변환**: `z.toJSONSchema(zodSchema, { target: 'draft-7' })` (Zod v4 내장).
- **Gemini 응답 형식**: `responseMimeType: 'application/json'` + `responseJsonSchema` 조합. 도구 호출(function calling) 미사용.
- **클라이언트 영속화**: `localStorage` 키 `gangnam-realty:land-permit-ai:session:v1`. 저장 직전 주민번호 마스킹(`(\d{6})-(\d{7}) → $1-*******`).
- **history 변환**: 클라이언트는 `'user'|'assistant'` 사용, 서버 측 `gemini-client.ts`에서 `'assistant' → 'model'` 변환.
- **MissingFieldsForm 트리거**: 서버가 `isComplete: true` 반환 시 (1) "검토 후 미리보기"(MissingFieldsForm)와 (2) "바로 미리보기" 두 버튼 제공. confidence='low' 필드는 노란 배지로 강조.
- **에러 메시지**: 503(키 미설정)/400(검증)/502(스키마 위반·Gemini 실패)로 통일, 모두 한국어 사용자 친화 문구.
- **PreviewPanel**: scenario 의존 제거. `missingFields` 단순 배열만 받아 미리보기에서 경고 표시.

## Issues

- **zod 4 호환 패키지 부재** (`zod-to-json-schema`는 zod v3 전용 시그니처).
  - **해결**: 패키지 제거 + `z.toJSONSchema` 사용으로 dependency 단순화.

## Manual Verification Notes (G4 권장 체크)

수동 검증 항목 — `GEMINI_API_KEY`가 설정되었을 때:
1. `/land-permit-ai`에 접속 → 4 케이스 카드 노출 확인.
2. self-occupy 선택 → greeting 메시지 출력.
3. "매수인은 이지은이고 010-9876-5432입니다. 토지는 강남구 압구정동 123-45번지" 메시지 입력 → assistantMessage가 후속 질문, answers에 buyer/land 정보 누적 확인.
4. 모든 필수 필드 채울 때까지 진행 → "검토 후 미리보기" 카드 출현 → 클릭 시 MissingFieldsForm → "확인하고 미리보기" → PreviewPanel.
5. PDF 단일 / ZIP 전체 다운로드 / QR 공유 기존과 동일하게 동작.
6. 새로고침 시 localStorage에서 세션 복원, 메시지 내 주민번호 마스킹 확인.
7. `GEMINI_API_KEY` 미설정 환경에서 메시지 전송 → ErrorBanner에 "AI 서비스 설정이 필요합니다." 표시(키/스택 노출 0).
8. `/land-permit` (절차형) 페이지 회귀 없음 — 라우트 정상 동작.
