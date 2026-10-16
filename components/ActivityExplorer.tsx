'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ACTIVITY_CATEGORIES } from '@/lib/categories';
import type { Activity, ActivityCategory } from '@/lib/types';
import { ArrowRight } from './icons';
import styles from './ActivityExplorer.module.css';

type Filter = 'all' | ActivityCategory;

const LABEL = Object.fromEntries(ACTIVITY_CATEGORIES.map((c) => [c.key, c.label])) as Record<ActivityCategory, string>;

export function ActivityExplorer({ activities }: { activities: Activity[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = filter === 'all' ? activities : activities.filter((a) => a.category === filter);
  const dated = visible.filter((a) => a.sortKey);
  const undated = visible.filter((a) => !a.sortKey);

  // 연도별로 묶기 (최신 연도 먼저)
  const byYear = new Map<string, Activity[]>();
  for (const a of dated) {
    const year = a.sortKey.slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), a]);
  }
  const years = [...byYear.keys()].sort((a, b) => b.localeCompare(a));

  const count = (key: Filter) => (key === 'all' ? activities.length : activities.filter((a) => a.category === key).length);

  return (
    <div className={styles.wrap}>
      <div className={styles.filters} role="group" aria-label="활동 분류">
        {(['all', ...ACTIVITY_CATEGORIES.map((c) => c.key)] as Filter[]).map((key) => (
          <button
            key={key}
            type="button"
            className={styles.filter}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {key === 'all' ? '전체' : LABEL[key]}
            <small>{count(key)}</small>
          </button>
        ))}
      </div>

      {years.map((year) => (
        <section key={year} className={styles.year} aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`} className={styles.yearTitle}>
            {year}
          </h2>
          <ol className={styles.items}>
            {byYear.get(year)!.map((a) => (
              <li key={a.key} className={styles.item}>
                {/* 연도만 있는 항목은 왼쪽 연도와 겹치므로 기간을 생략 */}
                <span className={styles.period}>{a.period !== year ? a.period : ''}</span>
                <div>
                  <p className={styles.cat}>
                    {LABEL[a.category]}
                    {a.ongoing && (
                      <span className="badge badge-accent">
                        <span className="dot dot-live" aria-hidden /> 진행 중
                      </span>
                    )}
                  </p>
                  <h3 className={styles.title}>{a.title}</h3>
                  {a.description && <p className={styles.desc}>{a.description}</p>}
                  {a.projectSlug && (
                    <Link href={`/#project-${a.projectSlug}`} className={styles.project}>
                      관련 프로젝트 보기 <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}

      {undated.length > 0 && (
        <section className={styles.year} aria-labelledby="year-ctf">
          <h2 id="year-ctf" className={styles.yearTitle}>
            CTF
          </h2>
          <ul className={`tags ${styles.ctf}`}>
            {undated.map((a) => (
              <li key={a.key} className="tag">
                {a.title}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
