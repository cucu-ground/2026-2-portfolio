import { ACTIVITY_CATEGORIES } from '@/lib/categories';
import type { Activity } from '@/lib/types';
import { SectionHead } from '../SectionHead';
import { Reveal } from '../Reveal';
import styles from './home.module.css';

const PREVIEW = 5;

export function ActivitySection({ activities }: { activities: Activity[] }) {
  return (
    <section id="activity" className="section section-alt">
      <div className="container">
        <SectionHead
          index="04"
          title="Activity."
          desc="대외활동, 공모전, 교내 활동과 CTF 참가 이력입니다."
          action={{ href: '/activity', label: '전체 타임라인' }}
        />
        <div className={styles.activityGrid}>
          {ACTIVITY_CATEGORIES.map((cat, i) => {
            const items = activities.filter((a) => a.category === cat.key);
            return (
              <Reveal key={cat.key} delay={i * 80}>
                <h3 className={styles.actHead}>
                  {cat.label}
                  <span>
                    {items.length}
                    <span className="sr-only">건</span>
                  </span>
                </h3>
                <ul className={styles.actList}>
                  {items.slice(0, PREVIEW).map((a) => (
                    <li key={a.key}>
                      {a.period && <span className={styles.actPeriod}>{a.period}</span>}
                      <span className={styles.actTitle}>{a.title}</span>
                      {a.ongoing && (
                        <div className={styles.actLive}>
                          <span className="badge badge-accent">
                            <span className="dot dot-live" aria-hidden /> 진행 중
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                  {items.length > PREVIEW && (
                    <li>
                      <span className={styles.actPeriod}>외 {items.length - PREVIEW}건</span>
                    </li>
                  )}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
