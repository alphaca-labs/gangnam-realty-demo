# Note — 001 land-permit-ai

## Findings
- [ ] qrcode.react v4의 `QRCodeSVG`는 `forwardRef<SVGSVGElement>`로 노출되므로 SVG → PNG 변환 시 `XMLSerializer + canvas` 조합이 가장 안정적이다 (data URL 직접 변환 시 영문 외 문자 인코딩 이슈 없음).
- [ ] lz-string의 `compressToEncodedURIComponent`는 URI-safe하므로 `#s=v1.{token}` 형태로 그대로 hash에 부착해도 추가 인코딩이 필요 없다.
- [x] Next.js 15 App Router에서 `output: 'export'` + `basePath`인 경우 `'use client'` 페이지에서 hash 기반 상태 복원은 page mount 후 useEffect에서 `window.location.hash`를 직접 파싱해야 한다 (Static Export는 SSR 컨텍스트가 없어 useSearchParams의 동적 파싱이 의미 없음).
- [x] features 모듈에 `next/*` import를 금지하면 모듈 자체가 페이지/Next 종속을 끊어 별도 웹 서비스로 분리하기 쉽다. 페이지 파일에서만 dynamic/Link/Image 등을 사용하도록 경계를 두는 것이 유효한 구조다.
- [ ] 토지대장 조회를 주소 입력과 한 컴포넌트에서 처리하면 사용자가 한 번의 선택으로 지번/지목/면적/용도지역 4필드를 자동 채울 수 있어 챗봇 UX가 절차형보다 빨라진다.
- [x] `Question.fillTargets`로 한 입력에서 여러 필드를 묶어서 채우는 패턴은 챗봇 시나리오에서 매우 유용 (절차 폼은 필드별 1:1이라 이 추상화가 필요 없었음). 향후 다른 챗봇 기능에도 재사용 가능.

## Decisions
- ChatState에서 `editingMessageId`를 따로 두기보다, 사용자가 user 메시지를 클릭하면 곧바로 `JUMP_TO`로 해당 question으로 점프 + 입력 영역에 기존 값을 prefill하는 방식 채택. 별도 모달/플로팅 편집 UI 없이도 일관된 챗 UI 안에서 수정 가능.
- 답변 제출 시 채팅 히스토리에는 새 user 메시지를 append하고 기존 메시지는 그대로 두기로 함 (사용자가 답변 변경 흐름을 추적할 수 있도록). 다만 reducer에서 동일 questionId 중복 시 hide할지는 추후 개선 여지.
- URL 길이 fallback: 2KB 초과 시 핵심 9개 필드(application 영역)만 인코딩. tax-deferral 같이 긴 textarea가 있는 케이스 보호용.
- ApplicationFormData의 `applicantName/Birth/Phone/Address`는 매수인 정보에서 자동 파생 (주민번호 앞 6자리 → birth 추출). 챗봇 질문 수를 줄이기 위함.
- privacy 동의 toggle 4개를 모두 받지만 default true → "예" 선택을 권장 흐름으로 안내 (CLAUDE.md "최적, 최선이 아니다" 원칙).

## Issues
- `qrcode.react@4`는 ref가 `RefAttributes<SVGSVGElement>`로 정확히 매칭되어 callback ref로 받을 필요 없이 useRef로 받을 수 있었음.
- `LandLookupResult.areaSqm`을 number로 두되 ApplicationFormData.landArea는 string이라 mapper에서 String 캐스팅 필요. shared question에서도 number 입력 후 string으로 저장.
- 양도세 유예 케이스에서 매도인=신청인이 아니라 매도인 정보를 별도로 받음. 서류 mapper의 `applicantName/Birth/Phone/Address`는 양 케이스 모두 매수인 기준으로 통일하여 기존 절차 페이지와 동일한 결과를 유지.
