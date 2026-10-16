import type { Metadata } from 'next';
import Link from 'next/link';
import { getActivities } from '@/lib/portfolio';
import { SectionHead } from '@/components/SectionHead';
import { ActivityExplorer } from '@/components/ActivityExplorer';
import { ArrowLeft } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Activity',
  description: 'WhiteHat School 4기, KISIA 정보보호정책공모전, 2026 JBU CTF 출제진 등 cucu의 활동 타임라인',
};

export default async function ActivityPage() {
  const activities = await getActivities();

  return (
    <>
      <div className="page-head">
        <div className="container">
          <Link href="/" className="back-link">
            <ArrowLeft size={14} /> home
          </Link>
          <SectionHead
            as="h1"
            title="Activity."
            desc="대외활동, 공모전, 교내 활동 · 운영, CTF 참가 이력을 연도별로 정리했습니다."
          />
        </div>
      </div>
      <div className="container">
        <ActivityExplorer activities={activities} />
      </div>
    </>
  );
}
