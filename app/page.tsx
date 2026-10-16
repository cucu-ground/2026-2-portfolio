import Link from 'next/link';
import { Suspense } from 'react';
import { getActivities, getDataSource, getProfile, getProjects, getSkillGroups } from '@/lib/portfolio';
import { readLikedSlugs } from '@/lib/likes';
import { Hero } from '@/components/home/Hero';
import { AboutSection } from '@/components/home/AboutSection';
import { SkillsSection } from '@/components/home/SkillsSection';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { ActivitySection } from '@/components/home/ActivitySection';
import { CourseSection } from '@/components/home/CourseSection';
import { GuestbookPreview, GuestbookPreviewSkeleton } from '@/components/home/GuestbookPreview';
import { SectionHead } from '@/components/SectionHead';
import { ArrowRight } from '@/components/icons';

// 메인 페이지: 스크롤을 내리면 모든 내용을 보여주고,
// 활동 타임라인과 방명록은 각 페이지(/activity, /guestbook)로 연결한다.
export default async function HomePage() {
  const [profile, projects, activities, skillGroups, likedSlugs, source] = await Promise.all([
    getProfile(),
    getProjects(),
    getActivities(),
    getSkillGroups(),
    readLikedSlugs(),
    getDataSource(),
  ]);

  return (
    <>
      <Hero profile={profile} projects={projects} />
      <AboutSection profile={profile} />
      <SkillsSection groups={skillGroups} />
      <ProjectsSection projects={projects} likedSlugs={likedSlugs} likesEnabled={source === 'mongodb'} />
      <ActivitySection activities={activities} />
      <CourseSection course={profile.course} />

      <section id="guestbook" className="section section-alt">
        <div className="container">
          <SectionHead
            index="06"
            title="Guestbook."
            desc="다녀가셨다면 한 줄 남겨주세요."
          />
          <Suspense fallback={<GuestbookPreviewSkeleton />}>
            <GuestbookPreview />
          </Suspense>
          <div style={{ marginTop: 32 }}>
            <Link href="/guestbook" className="btn btn-primary">
              방명록 남기기 <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
