import { Suspense } from 'react';
import type { CourseProject } from '@/lib/types';
import { SectionHead } from '../SectionHead';
import { Reveal } from '../Reveal';
import { ArrowUpRight, Check, GitHub } from '../icons';
import { CommitList, CommitListSkeleton } from './CommitList';
import styles from './home.module.css';

const strip = (url: string) => url.replace(/^https?:\/\//, '');

export function CourseSection({ course }: { course: CourseProject }) {
  return (
    <section id="course" className="section">
      <div className="container">
        <SectionHead
          index="05"
          title="Course Project."
          desc="지금 강의에서 실습하고 있는 프로젝트의 저장소와 배포 사이트입니다."
        />
        <Reveal className={`card ${styles.course}`}>
          <div>
            <p className="kicker">
              {course.course} · {course.title}
            </p>
            <h3 className={styles.courseTitle}>{course.repoName}</h3>
            <p className={styles.courseDesc}>{course.description}</p>
            <div className={styles.courseLinks}>
              <a href={course.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                배포 사이트 <ArrowUpRight />
              </a>
              <a href={course.repoUrl} target="_blank" rel="noopener noreferrer" className="btn">
                <GitHub /> 저장소
              </a>
            </div>
            <dl className={styles.courseUrls}>
              <div>
                <dt>Repository</dt>
                <dd>
                  <a href={course.repoUrl} target="_blank" rel="noopener noreferrer">
                    {strip(course.repoUrl)}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Deploy</dt>
                <dd>
                  <a href={course.demoUrl} target="_blank" rel="noopener noreferrer">
                    {strip(course.demoUrl)}
                  </a>
                </dd>
              </div>
            </dl>
            <ul className="tags">
              {course.stack.map((s) => (
                <li key={s} className="tag">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.sideTitle}>구현한 기능</h4>
            <ul className={styles.featureList}>
              {course.features.map((f) => (
                <li key={f}>
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <h4 className={styles.sideTitle}>
              최근 커밋 <small>GitHub API</small>
            </h4>
            <Suspense fallback={<CommitListSkeleton />}>
              <CommitList repo={course.repoName} repoUrl={course.repoUrl} />
            </Suspense>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
