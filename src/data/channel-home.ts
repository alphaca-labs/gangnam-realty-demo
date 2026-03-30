export interface LinkItem {
  title: string;
  description?: string;
  url: string;
}

export interface FrequentMenuItem {
  title: string;
  description: string;
  href?: string;
  url?: string;
}

export const noticeLinks: LinkItem[] = [
  {
    title: '의견 보내기',
    description: '서비스 개선 의견은 피드백 페이지로 접수해 주세요.',
    url: 'https://gangnam-inquiry.alphaca.kr/feedback',
  },
  {
    title: '강남부동산톡 메인',
    description: '웹버전 확장판 메인 서비스로 이동합니다.',
    url: 'https://gangnam-inquiry.alphaca.kr/',
  },
];

export const latestNewsLinks: LinkItem[] = [
  {
    title: '부동산 관련 최신 소식 (보도자료)',
    description: '한국부동산원 보도자료 원문',
    url: 'https://www.reb.or.kr/reb/na/ntt/selectNttInfo.do?mi=9565&bbsId=1154&nttSn=112925',
  },
];

export const frequentMenus: FrequentMenuItem[] = [
  {
    title: '민원서식 목록',
    description: '민원서식 모음을 확인하고 필요한 서식을 바로 내려받으세요.',
    url: 'https://www.gangnam.go.kr/board/B_000060/list.do?mid=ID03_010104&pgno=1&lists=10&deptField=BDM_DEPT_ID&deptId=3220178&keyfield=bdm_main_title&keyword=',
  },
  {
    title: '부동산 계약 신고서 안내',
    description: '변경신고/해제신고/별지 및 위임장/신고서 양식 안내를 제공합니다.',
    href: '/contract/',
  },
  {
    title: '토지거래허가구역 안내',
    description: '실거주 의무, 허가 기준, 관리/단속 등 핵심 내용을 확인합니다.',
    href: '/civil/',
  },
  {
    title: '공인중개사사무소 개설·이전 안내',
    description: '개설등록 신청, 이전신고, 유의사항, 제출서류를 확인합니다.',
    href: '/civil/',
  },
];

export const quickSiteLinks: LinkItem[] = [
  { title: '정부24', url: 'https://plus.gov.kr/' },
  { title: '서울시 부동산 정보광장', url: 'https://land.seoul.go.kr/land/' },
  { title: '강남구청 홈페이지', url: 'https://www.gangnam.go.kr/main.do' },
];

export const channelQuickMenus: LinkItem[] = [
  {
    title: '공인중개사 연구교육 신청',
    url: 'https://www.gangnam.go.kr/apply/edu_estate_agent/list.do?mid=ID04_040503',
  },
  {
    title: '지번별 종합정보 조회',
    url: 'http://land.gangnam.go.kr/land/wskras/generalInfo.do',
  },
  {
    title: '부동산중개보수',
    url: 'http://land.gangnam.go.kr/land/broker/brokerageCommission.do',
  },
  {
    title: '개업공인중개사 사무소',
    url: 'http://land.gangnam.go.kr/land/broker/brokerInfo.do',
  },
  {
    title: '부동산거래 전자계약시스템',
    url: 'https://irts.molit.go.kr/',
  },
];
