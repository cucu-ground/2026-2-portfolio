// 포트폴리오 데이터 접근 계층
// - 모든 읽기는 MongoDB에서 한다.
// - 처음 요청 때(또는 lib/content.ts 내용이 바뀌었을 때) 그 내용을 MongoDB에 동기화한다.
// - DB 연결이 안 되면 사이트가 통째로 죽지 않도록 시드 데이터로 대신 보여주고,
//   /api/portfolio 응답의 source 값으로 현재 데이터 출처(mongodb / fallback)를 확인할 수 있다.

import { createHash } from 'node:crypto';
import { cache } from 'react';
import { connection } from 'next/server';
import { connectDB, hasMongoUri } from './mongodb';
import { activities, profile, projects, skillGroups } from './content';
import type { Activity, DataSource, Profile, ProjectWithStats, SkillGroup } from './types';
import { ProfileModel } from '@/models/Profile';
import { ProjectModel } from '@/models/Project';
import { ActivityModel } from '@/models/Activity';
import { SkillGroupModel } from '@/models/SkillGroup';
import { MetaModel } from '@/models/Meta';

// ---------- 시드 → MongoDB 동기화 ----------

// content.ts 내용의 지문(해시). 글자 하나만 바뀌어도 값이 달라지므로,
// 버전 번호를 손으로 올리지 않아도 바뀐 내용을 알아서 다시 동기화한다.
const CONTENT_VERSION = createHash('sha256')
  .update(JSON.stringify({ profile, projects, activities, skillGroups }))
  .digest('hex')
  .slice(0, 16);

type SyncCache = { version: string; promise: Promise<void> | null };

declare global {
  var contentSync: SyncCache | undefined;
}

async function syncContent() {
  await connectDB();

  const meta = await MetaModel.findOne({ key: 'content' }).lean<{ version?: string }>();
  if (meta?.version === CONTENT_VERSION) return;

  await ProfileModel.updateOne({ key: 'main' }, { $set: { key: 'main', ...profile } }, { upsert: true });

  await ProjectModel.bulkWrite(
    projects.map((p) => ({
      updateOne: {
        filter: { slug: p.slug },
        // likes는 방문자 데이터라서 새 문서일 때만 0으로 만든다.
        update: { $set: p, $setOnInsert: { likes: 0 } },
        upsert: true,
      },
    })),
  );
  await ProjectModel.deleteMany({ slug: { $nin: projects.map((p) => p.slug) } });
  // 이전 버전(케이스 스터디)에서 쓰던 필드는 스키마에 없어서 mongoose가 무시하므로, 드라이버로 직접 지운다
  await ProjectModel.collection.updateMany(
    {},
    {
      $unset: {
        blocks: '', metrics: '', highlights: '', summary: '', context: '',
        period: '', team: '', role: '', links: '', featured: '',
      },
    },
  );

  await ActivityModel.bulkWrite(
    activities.map((a) => ({
      updateOne: { filter: { key: a.key }, update: { $set: a }, upsert: true },
    })),
  );
  await ActivityModel.deleteMany({ key: { $nin: activities.map((a) => a.key) } });

  await SkillGroupModel.bulkWrite(
    skillGroups.map((g) => ({
      updateOne: { filter: { key: g.key }, update: { $set: g }, upsert: true },
    })),
  );
  await SkillGroupModel.deleteMany({ key: { $nin: skillGroups.map((g) => g.key) } });

  await MetaModel.updateOne(
    { key: 'content' },
    { $set: { version: CONTENT_VERSION, syncedAt: new Date() } },
    { upsert: true },
  );
}

function ensureSynced() {
  if (!global.contentSync || global.contentSync.version !== CONTENT_VERSION) {
    global.contentSync = { version: CONTENT_VERSION, promise: null };
  }
  const state = global.contentSync;
  if (!state.promise) {
    state.promise = syncContent().catch((err) => {
      state.promise = null; // 다음 요청에서 다시 시도
      throw err;
    });
  }
  return state.promise;
}

// DB에서 읽고, 실패하면 시드 데이터로 대신한다.
async function readWithFallback<T>(label: string, read: () => Promise<T>, fallback: () => T) {
  await connection(); // 요청 시점에 렌더링 (빌드 때 DB에 접근하지 않음)
  if (!hasMongoUri()) return fallback();
  try {
    await ensureSynced();
    return await read();
  } catch (err) {
    console.error(`[portfolio] ${label}: MongoDB 읽기 실패, 시드 데이터로 대체합니다.`, err);
    return fallback();
  }
}

// ---------- 문서 → 화면용 객체 변환 (ObjectId 등 직렬화 안 되는 값 제거) ----------

type Doc = Record<string, unknown>;

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const strArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

function toProject(doc: Doc): ProjectWithStats {
  return {
    slug: str(doc.slug),
    order: Number(doc.order ?? 0),
    title: str(doc.title),
    tags: strArr(doc.tags),
    description: str(doc.description),
    results: strArr(doc.results),
    images: Array.isArray(doc.images)
      ? (doc.images as Doc[]).map((img) => ({
          src: str(img.src),
          alt: str(img.alt),
          width: Number(img.width ?? 0),
          height: Number(img.height ?? 0),
        }))
      : [],
    likes: Number(doc.likes ?? 0),
  };
}

function toActivity(doc: Doc): Activity {
  return {
    key: str(doc.key),
    category: str(doc.category) as Activity['category'],
    title: str(doc.title),
    period: str(doc.period),
    sortKey: str(doc.sortKey),
    ongoing: Boolean(doc.ongoing),
    description: str(doc.description),
    ...(doc.projectSlug ? { projectSlug: str(doc.projectSlug) } : {}),
  };
}

function toSkillGroup(doc: Doc): SkillGroup {
  return {
    key: str(doc.key),
    order: Number(doc.order ?? 0),
    title: str(doc.title),
    description: str(doc.description),
    items: Array.isArray(doc.items)
      ? (doc.items as Doc[]).map((i) => ({ name: str(i.name) }))
      : [],
  };
}

function toProfile(doc: Doc): Profile {
  const links = (doc.links ?? {}) as Doc;
  const course = (doc.course ?? {}) as Doc;
  return {
    handle: str(doc.handle),
    tagline: str(doc.tagline),
    headline: strArr(doc.headline),
    headlineEm: str(doc.headlineEm),
    headlineTail: str(doc.headlineTail),
    summary: str(doc.summary),
    about: strArr(doc.about),
    facts: Array.isArray(doc.facts)
      ? (doc.facts as Doc[]).map((f) => ({ label: str(f.label), value: str(f.value) }))
      : [],
    now: Array.isArray(doc.now)
      ? (doc.now as Doc[]).map((n) => ({
          label: str(n.label),
          detail: str(n.detail),
          ...(n.href ? { href: str(n.href) } : {}),
        }))
      : [],
    links: { github: str(links.github), blog: str(links.blog) },
    course: {
      course: str(course.course),
      title: str(course.title),
      description: str(course.description),
      repoUrl: str(course.repoUrl),
      repoName: str(course.repoName),
      demoUrl: str(course.demoUrl),
      stack: strArr(course.stack),
      features: strArr(course.features),
    },
  };
}

const sortProjects = <T extends { order: number }>(list: T[]) => [...list].sort((a, b) => a.order - b.order);

// ---------- 공개 함수 (React cache로 한 요청 안에서는 한 번만 실행) ----------

export const getDataSource = cache(async (): Promise<DataSource> => {
  await connection();
  if (!hasMongoUri()) return 'fallback';
  try {
    await ensureSynced();
    return 'mongodb';
  } catch {
    return 'fallback';
  }
});

export const getProfile = cache(() =>
  readWithFallback(
    'profile',
    async () => {
      const doc = await ProfileModel.findOne({ key: 'main' }).lean<Doc>();
      if (!doc) throw new Error('profile 문서가 없습니다.');
      return toProfile(doc);
    },
    () => profile,
  ),
);

export const getProjects = cache(() =>
  readWithFallback(
    'projects',
    async () => {
      const docs = await ProjectModel.find().sort({ order: 1 }).lean<Doc[]>();
      return docs.map(toProject);
    },
    () => sortProjects(projects).map((p) => ({ ...p, likes: 0 })),
  ),
);

export const getActivities = cache(() =>
  readWithFallback(
    'activities',
    async () => {
      const docs = await ActivityModel.find().sort({ sortKey: -1, title: 1 }).lean<Doc[]>();
      return docs.map(toActivity);
    },
    () => [...activities].sort((a, b) => b.sortKey.localeCompare(a.sortKey) || a.title.localeCompare(b.title)),
  ),
);

export const getSkillGroups = cache(() =>
  readWithFallback(
    'skills',
    async () => {
      const docs = await SkillGroupModel.find().sort({ order: 1 }).lean<Doc[]>();
      return docs.map(toSkillGroup);
    },
    () => sortProjects(skillGroups),
  ),
);
