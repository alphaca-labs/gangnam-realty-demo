# Note — 003 auto-land-lookup

## Findings

- [ ] arch가 사전에 트리거 조건/엔드포인트/PNU 합성/스키마 확장을 모두 결정해 둔 상태였으므로 eng는 구현에 집중. arch 단계 완성도가 높을수록 eng 작업이 단순 직선화됨.
- [x] Next.js + `import 'server-only'` 만으로는 코드를 server-only로 만들기에 충분하지만, **env 참조의 위치까지 server-only 모듈로 한정**해야 정적 분석/grep 검증이 깔끔해진다. orchestrator(`auto-lookup.ts`)에서 `process.env.X`를 직접 읽지 말고, `lookup/{kakao,vworld}.ts`가 제공하는 `getXApiKey()` getter를 통해 읽도록 하면 환경변수 단일 소유권이 보장된다.
- [x] `MockLandLookupProvider.lookup`은 `LandLookupResult`를 반환하지만, 클라이언트 노출되는 `source: 'mock' | 'vworld'` 필드가 cache/orchestrator의 source 분리(failed 포함)와 충돌. **orchestrator는 mock 결과를 `CombinedLandData`로 정규화해 source는 별도로 관리**해야 안전. (내부 source를 그대로 외부 응답에 흘리지 말 것.)
- [x] TypeScript narrowing 함정: `if (X !== 'failed')` 분기로 일찍 return해 둔 뒤, 나중 코드에서 다시 `if (source !== 'failed')` 비교하면 "no overlap" 컴파일 에러 발생. early return으로 narrow된 시점부터는 그 비교를 제거해야 한다.
- [ ] VWorld의 `lndcgr_code_nm` / `prpos_area_dstrc_nm_1` 같은 컬럼명은 layer/version에 따라 다양함. zod로 강제 검증하지 말고 `passthrough + asString` 폴백 체인으로 복수 candidate 키를 시도하는 게 견고함.
- [ ] VWorld 200 OK + `response.status: 'NOT_FOUND'` 케이스를 명시적으로 처리. status가 'OK'가 아니면 features 추출 자체를 중단해야 NaN/빈 문자열 같은 부산물이 응답에 들어가지 않음.
- [ ] LRU 구현은 `Map` insertion-order 보장을 활용. get 시 delete→set 재삽입으로 자연스러운 LRU. Node 런타임에서 module-level Map은 process 라이프사이클 동안 안정적.
- [x] 클라이언트로 흘리는 `autoLookup.note`를 **chat 메시지로 push하면 다음 턴 LLM history에 포함되어 LLM이 자기 발화로 오인**할 위험이 있음. 별도 transient state (`useState<AutoLookupMeta | null>`)로 보관하고 banner로만 표시하면 history 오염 0. (store/reducer/persist 변경도 회피되어 변경 폭 최소.)

## Decisions

- 신규 server-only 모듈 위치: `src/features/land-permit-ai/llm/lookup/*` + `llm/auto-lookup.ts` (arch 결정 그대로). 기존 `providers/{kakao,vworld}-*` skeleton은 보존 (수정 0).
- `landArea`는 정수 m² 문자열로 저장 (`String(Math.round(areaSqm))`) — application schema가 `string`이므로 호환 유지.
- 자동 조회는 `application.{landCategory,landArea,landZone}`만 채움. 이미 채워진 필드는 덮어쓰지 않음 (사용자 수정값 보호).
- 캐시 키는 `sha1(`${normalizedAddress.toLowerCase()}|${lotNumber}`)`. 주소 정정 시 키가 자동으로 달라져 자연스러운 cache miss → 재조회.
- env getter는 `lookup/kakao.ts` / `lookup/vworld.ts`가 export. orchestrator는 getter만 호출 → grep 시 `process.env.{KAKAO_REST_API_KEY,VWORLD_API_KEY}` 참조처 1곳씩 정확히 보장.

## Issues

- (해결) TypeScript "no overlap" — early return으로 narrowed된 source 비교 제거.
- (해결) MockLandLookupProvider source ↔ orchestrator source 충돌 — orchestrator가 결과를 CombinedLandData로 정규화.

## Verification

- `npm run build` 통과 (TypeScript 검증 포함).
- `grep VWORLD_API_KEY|KAKAO_REST_API_KEY .next/static/`: 0건 (클라이언트 번들 leak 0).
- `grep applyAutoLandLookup|llm/lookup .next/static/`: 0건 (server-only 모듈 client 번들 침투 0).
- `process.env.VWORLD_API_KEY` 참조: `llm/lookup/vworld.ts` 단 1곳.
- `process.env.KAKAO_REST_API_KEY` 참조: `llm/lookup/kakao.ts` 단 1곳.
- `grep scenarios|conditional|selectors|ChatEngine src/features/land-permit-ai/`: 0건 (002 결정 트리 잔재 부재 유지).
