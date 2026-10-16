import type { SkillGroup } from '@/lib/types';
import { SectionHead } from '../SectionHead';
import { Reveal } from '../Reveal';
import styles from './home.module.css';

export function SkillsSection({ groups }: { groups: SkillGroup[] }) {
  return (
    <section id="skills" className="section section-alt">
      <div className="container">
        <SectionHead index="02" title="Skills." />
        <div className={styles.skillGrid}>
          {groups.map((g, i) => (
            <Reveal
              key={g.key}
              delay={(i % 3) * 80}
              className={`card ${styles.skillCard}`}
            >
              <h3 className={styles.skillTitle}>{g.title}</h3>
              {g.description && (
                <p className={styles.skillDesc}>{g.description}</p>
              )}
              <ul className="tags">
                {g.items.map((item) => (
                  <li key={item.name} className="tag">
                    {item.name}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
