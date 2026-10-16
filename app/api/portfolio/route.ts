import { NextResponse } from 'next/server';
import { getActivities, getDataSource, getProfile, getProjects, getSkillGroups } from '@/lib/portfolio';

// GET /api/portfolio — 포트폴리오 데이터를 JSON으로 제공 (MongoDB에서 읽음)
export async function GET() {
  const [source, profile, projects, activities, skills] = await Promise.all([
    getDataSource(),
    getProfile(),
    getProjects(),
    getActivities(),
    getSkillGroups(),
  ]);

  return NextResponse.json({
    source,
    profile: {
      handle: profile.handle,
      tagline: profile.tagline,
      summary: profile.summary,
      facts: profile.facts,
      links: profile.links,
      course: profile.course,
    },
    projects,
    activities,
    skills,
  });
}
