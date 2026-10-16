// 포트폴리오 데이터 타입
// MongoDB에 저장되는 문서와 화면 컴포넌트가 같은 타입을 공유한다.

export type Fact = { label: string; value: string };

export type NowItem = { label: string; detail: string; href?: string };

export type CourseProject = {
  course: string;
  title: string;
  description: string;
  repoUrl: string;
  repoName: string;
  demoUrl: string;
  stack: string[];
  features: string[];
};

export type Profile = {
  handle: string;
  tagline: string;
  headline: string[];
  headlineEm: string;
  headlineTail: string;
  summary: string;
  about: string[];
  facts: Fact[];
  now: NowItem[];
  links: { github: string; blog: string };
  course: CourseProject;
};

// ---------- 프로젝트 ----------

export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  order: number;
  title: string;
  tags: string[];
  description: string;
  results: string[];
  images: ProjectImage[];
};

// DB에서 읽을 때 붙는 값 (좋아요 수)
export type ProjectWithStats = Project & { likes: number };

// ---------- 활동 ----------

export type ActivityCategory = 'external' | 'contest' | 'campus' | 'ctf';

export type Activity = {
  key: string;
  category: ActivityCategory;
  title: string;
  period: string;
  sortKey: string; // YYYY-MM-DD (정렬용, 날짜 없는 항목은 빈 문자열)
  ongoing: boolean;
  description: string;
  projectSlug?: string;
};

// ---------- 기술 ----------

export type SkillGroup = {
  key: string;
  order: number;
  title: string;
  description: string;
  items: { name: string }[];
};

// ---------- 방명록 ----------

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string; // ISO
};

export type DataSource = 'mongodb' | 'fallback';
