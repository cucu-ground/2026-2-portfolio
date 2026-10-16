// 배포 주소: 직접 지정한 값 → Vercel이 넣어주는 운영 도메인 → 로컬 순서로 사용
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const siteDescription =
  '금융 보안에 관심 있는 보안 전공 대학생 cucu의 포트폴리오. 프로젝트, 활동 이력, 수업 실습 프로젝트를 소개합니다.';
