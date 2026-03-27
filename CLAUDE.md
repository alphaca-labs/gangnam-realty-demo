# CLAUDE.md

## Project: 강남부동산톡 웹버전 v2

ChatGPT 웹 UI 스타일의 AI 부동산 상담 데모 사이트.

## Key Rules
- **한국어 UI** — 모든 텍스트 한국어
- **Static Export** — GitHub Pages 배포 (output: 'export', basePath: '/gangnam-realty-demo')
- **No API calls** — 모든 데이터 하드코딩/목데이터
- **Mobile First** — 반응형 필수
- **ChatGPT 스타일** — 사이드바 + 채팅 UI + 리치 응답

## Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS
- shadcn/ui
- Recharts (차트)
- Lucide React (아이콘)
- Pretendard 폰트 (CDN)

## 상세 기획서
SPEC.md 참조. 반드시 읽고 따를 것.
EOF 

# Claude Code 실행
claude --permission-mode bypassPermissions --print "
기존 v1 코드를 전부 삭제하고 v2로 새로 만들어야 합니다.

SPEC.md를 읽고 강남부동산톡 웹버전 v2를 처음부터 완전히 새로 개발하세요.

## 핵심 요구사항

1.  **ChatGPT 웹 스타일 레이아웃**
2.  **메인 채팅 페이지** (5개 시나리오 하드코딩)
3.  **기능별 8개 샘플 페이지** (사이드바 메뉴)
    ① 중개수수료 계산기 (실동작)
    ② 중개대상물 확인서 (목업)
    ③ 전자계약 가이드
    ④ 웹버전 타입별 출력 예시
    ⑤ 실거래가 대시보드 (Recharts)
    ⑥ 부동산 지도 (정적 이미지 기반)
    ⑦ 민원 절차 가이드
    ⑧ AI 상담 고도화 비교
4.  **디자인**: ChatGPT 스타일, 강남구 블루(#1B4D8E) + 그린(#10A37F) 포인트
5.  **기술**: Next.js 15, Tailwind, shadcn/ui. **Static export**로 GitHub Pages 배포.

## 작업 순서
1. 기존 코드(app/, components/ 등) 삭제
2.  구조로 새로 생성
3. 패키지 설치
4. 레이아웃(사이드바) -> 메인 채팅 -> 기능 페이지 순으로 구현
5. 
> gangnam-realty-temp@0.1.0 build
> next build로 빌드 확인
6. 완료 후 , , 

완료되면, ok 명령어를 실행하여 알려주세요.
" > "/Users/alphaca/.openclaw/workspace/logs/gangnam-realty-v2-1774590561.log" 2>&1

echo "Log file: /Users/alphaca/.openclaw/workspace/logs/gangnam-realty-v2-1774590561.log"
