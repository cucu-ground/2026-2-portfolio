// 포트폴리오 원본 데이터 (MongoDB 시드)
// 내용을 고치고 저장하면, 다음 요청 때 MongoDB 문서가 이 내용으로 자동 동기화된다.
// (좋아요 수, 방명록처럼 사용자가 만든 데이터는 동기화 대상이 아니라서 그대로 유지된다.)

import type { Activity, Profile, Project, SkillGroup } from './types';

export const profile: Profile = {
  handle: '이효정',
  tagline: '정보보호학과 2학년',
  headline: ['금융 보안에', '관심 있는'],
  headlineEm: '보안 전공 대학생',
  headlineTail: '입니다.',
  summary: '최종적으로 금융 보안 관련 직무로 취직하는 것이 목표입니다.',
  about: [
    '정보보호학과에 다니면서 금융 보안 분야를 공부하고 있습니다. 금융 서비스와 고객의 자산을 안전하게 지키는 일에 관심이 있습니다.',
    'WhiteHat School 4기에서 가상 금융회사를 ISMS-P 기준으로 진단하는 프로젝트를 하며, 망분리와 전자금융감독규정처럼 금융권에서 요구하는 보안을 직접 다뤄 봤습니다.',
    '나중에는 4대 금융회사 중 1곳에 취직하고 싶습니다.',
  ],
  facts: [
    { label: '전공', value: '정보보호학과' },
    { label: '관심 분야', value: '금융 보안' },
    { label: '목표', value: '4대 금융회사 중 1곳에 취직하기' },
    { label: '동아리', value: 'S.C.P' },
    { label: '현재', value: 'WhiteHat School 4기' },
  ],
  now: [
    {
      label: 'WhiteHat School 4기',
      detail: '2026.06.08 ~ 진행 중',
      href: '/activity',
    },
    {
      label: '웹서버보안프로그래밍',
      detail: 'Next.js · MongoDB 수업 프로젝트 주차별 실습 중',
      href: '/#course',
    },
    {
      label: 'KISIA 정보보호정책공모전',
      detail: '2026.10.11 참가',
      href: '/activity',
    },
  ],
  links: {
    github: 'https://github.com/cucu-ground',
    blog: 'https://cucu0417.tistory.com/',
  },
  course: {
    course: '웹서버보안프로그래밍',
    title: '수업 실습 프로젝트',
    description:
      '이번 학기 수업에서 주차별로 기능을 쌓아 가고 있는 Next.js 프로젝트입니다. 이 포트폴리오도 같은 수업에서 배운 구조(App Router, Server Action, MongoDB)를 바탕으로 만들었습니다.',
    repoUrl: 'https://github.com/cucu-ground/assignments-92513326',
    repoName: 'cucu-ground/assignments-92513326',
    demoUrl: 'https://assignments-92513326.vercel.app',
    stack: [
      'Next.js 16',
      'React 19',
      'MongoDB (mongoose)',
      'NextAuth',
      'TypeScript',
    ],
    features: [
      'App Router 파일 기반 라우팅과 Server / Client Component 구분',
      '상품 목록 · 상세 동적 라우트와 Server Action 좋아요 버튼',
      'MongoDB 공지사항 게시판 (목록 · 상세 · 작성, 조회수 증가)',
      'loading.tsx · error.tsx 로 로딩 / 에러 화면 처리',
      'NextAuth Credentials 회원가입 · 로그인 (bcrypt 비밀번호 해시)',
      'Route Handler JSON API',
    ],
  },
};

// 프로젝트는 기존 포트폴리오와 같은 수준으로만 적는다: 태그, 제목, 설명, 결과, 화면
export const projects: Project[] = [
  {
    slug: 'isms-p-financial-consulting',
    order: 1,
    title: 'ISMS-P 기반 가상 금융회사 컨설팅',
    tags: ['ISMS-P', '전자금융감독규정', 'AWS', '위험평가'],
    description:
      'WhiteHat School 4기 팀 프로젝트로, 가상 전자금융회사 ‘한빛페이’를 직접 설계하고 ISMS-P 인증기준으로 진단해 개선 방안까지 도출한 프로젝트입니다.',
    results: [
      '네트워크 구성도 · 인프라 담당 (AWS 멀티 어카운트 구조 설계)',
      '위험평가 위험식 산정 담당 (위험도 = 영향도 × 노출도)',
      '인증기준 101개 항목 갭 분석 → 위험 96건 식별 · 평가 → 조치계획 수립',
    ],
    images: [],
  },
  {
    slug: 'board-pentest',
    order: 2,
    title: '게시판 구현 및 취약점 보고서 작성',
    tags: ['PHP', 'MySQL', 'HTML', 'CSS'],
    description:
      'PHP와 MySQL로 게시판을 직접 만들고, 동아리원들과 서로의 게시판을 뚫어보는 프로젝트입니다. CRUD 기능과 게시판 기본 기능들을 구현한 다음 침투 테스트를 진행했습니다.',
    results: [
      '게시글 작성 / 수정 / 삭제 / 조회 기능 및 기본 기능 구현',
      '침투 테스트로 보안 취약점 9종 발견',
      '취약점 분석 보고서 작성',
    ],
    images: [
      {
        src: '/images/board-write.png',
        alt: '직접 만든 게시판의 글쓰기 화면. 제목, 내용, 파일 첨부 입력란이 있고 webshell.php 파일이 선택되어 있다.',
        width: 1224,
        height: 1081,
      },
      {
        src: '/images/board-report.png',
        alt: '취약점 분석 보고서 일부. Case 3 데이터 탈취 Blind SQL Injection 항목으로, 요청과 응답 비교 화면이 있다.',
        width: 1136,
        height: 1252,
      },
    ],
  },
  {
    slug: 'sudo-cve-fuzzing',
    order: 3,
    title: 'sudo CVE 탐색',
    tags: ['C', 'AFL++', 'Linux'],
    description:
      'AFL Fuzzer를 이용해 sudo 소스코드를 분석하고 새로운 CVE를 찾으려 한 프로젝트입니다. 결과적으로 reject 됐지만 코드 분석이랑 퍼징 경험을 많이 쌓았습니다.',
    results: [
      'sudo 코드베이스 구조 분석 (plugins/sudoers/ 등)',
      'AFL++ 퍼징 환경 구축 (ASAN / LTO 빌드)',
      '의심 부분 12개 발견 → 최종 reject',
      'CVE-2019-14287 등 기존 취약점 분석',
    ],
    images: [],
  },
];

export const activities: Activity[] = [
  {
    key: 'whs-4',
    category: 'external',
    title: 'WhiteHat School 4기',
    period: '2026.06.08 – 현재',
    sortKey: '2026-06-08',
    ongoing: true,
    description:
      '팀 프로젝트로 ISMS-P 기반 가상 금융회사 컨설팅을 수행했습니다.',
    projectSlug: 'isms-p-financial-consulting',
  },
  {
    key: 'hspace-nightsfrontier',
    category: 'external',
    title: 'HSPACE NightsFrontier 수료',
    period: '2025.09 – 2026.04',
    sortKey: '2025-09-01',
    ongoing: false,
    description: '',
  },
  {
    key: 'kisia-2026',
    category: 'contest',
    title: 'KISIA 정보보호정책공모전 참가',
    period: '2026.10.11',
    sortKey: '2026-10-11',
    ongoing: false,
    description: '',
  },
  {
    key: 'kisia-2025',
    category: 'contest',
    title: 'KISIA 정책 공모전 참가',
    period: '2025',
    sortKey: '2025-01-01',
    ongoing: false,
    description: '',
  },
  {
    key: 'jbu-ctf-2026-staff',
    category: 'campus',
    title: '2026 JBU CTF 출제진',
    period: '2026',
    sortKey: '2026-01-01',
    ongoing: false,
    description: '교내 CTF 문제 출제',
  },
  {
    key: 'scp-officer',
    category: 'campus',
    title: 'S.C.P 임원진',
    period: '2025 – 현재',
    sortKey: '2025-01-01',
    ongoing: true,
    description: '보안 동아리 운영',
  },
  {
    key: 'cce-ctf',
    category: 'ctf',
    title: 'CCE CTF',
    period: '',
    sortKey: '',
    ongoing: false,
    description: '',
  },
  {
    key: 'jbu-ctf',
    category: 'ctf',
    title: 'JBU CTF',
    period: '',
    sortKey: '',
    ongoing: false,
    description: '',
  },
  {
    key: 'incognito-ctf',
    category: 'ctf',
    title: 'INC0GNITO CTF',
    period: '',
    sortKey: '',
    ongoing: false,
    description: '',
  },
  {
    key: 'codegate-ctf',
    category: 'ctf',
    title: 'CodeGate CTF',
    period: '',
    sortKey: '',
    ongoing: false,
    description: '',
  },
  {
    key: 'knightsfrontier-ctf',
    category: 'ctf',
    title: 'KnightsFrontier CTF',
    period: '',
    sortKey: '',
    ongoing: false,
    description: '',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    key: 'offensive',
    order: 1,
    title: 'Offensive Security',
    description: '취약점을 찾고 공격 과정을 보고서로 정리',
    items: [
      { name: 'System Hacking' },
      { name: 'Binary Exploitation' },
      { name: 'Web Security' },
      { name: 'Fuzzing (AFL++)' },
      { name: '취약점 분석 보고서' },
    ],
  },
  {
    key: 'governance',
    order: 2,
    title: 'Financial Security · Compliance',
    description: '금융권 기준으로 진단하고 위험을 평가',
    items: [
      { name: 'ISMS-P 인증기준' },
      { name: '전자금융감독규정' },
      { name: '갭 분석' },
      { name: '위험평가 · 산정식 설계' },
      { name: '망분리 · N2SF' },
    ],
  },
  {
    key: 'cloud',
    order: 3,
    title: 'Cloud · Infra',
    description: '클라우드 네트워크 구조를 설계하고 점검',
    items: [
      { name: 'AWS 멀티 어카운트 설계' },
      { name: 'VPC · Transit Gateway' },
      { name: 'Network Firewall · WAF' },
      { name: 'Terraform' },
      { name: 'Prowler (CIS Benchmark)' },
      { name: 'Linux' },
      { name: 'Docker' },
    ],
  },
  {
    key: 'languages',
    order: 4,
    title: 'Languages',
    description: '',
    items: [
      { name: 'C' },
      { name: 'Python' },
      { name: 'Go' },
      { name: 'PHP' },
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'MySQL' },
    ],
  },
  {
    key: 'web',
    order: 5,
    title: 'Web',
    description: '',
    items: [
      { name: 'Next.js' },
      { name: 'React' },
      { name: 'MongoDB' },
      { name: 'HTML / CSS' },
    ],
  },
  {
    key: 'tools',
    order: 6,
    title: 'Tools',
    description: '',
    items: [
      { name: 'Git' },
      { name: 'GDB / pwndbg' },
      { name: 'pwntools' },
      { name: 'IDA' },
    ],
  },
];
