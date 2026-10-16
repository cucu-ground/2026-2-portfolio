import type { Profile } from '@/lib/types';
import { SectionHead } from '../SectionHead';
import { Reveal } from '../Reveal';
import { ArrowUpRight, GitHub } from '../icons';
import styles from './home.module.css';

export function AboutSection({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHead index="01" title="About." />
        <div className={styles.aboutGrid}>
          <Reveal className={styles.aboutText}>
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className={styles.aboutLinks}>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn">
                <GitHub /> GitHub
              </a>
              <a href={profile.links.blog} target="_blank" rel="noopener noreferrer" className="btn">
                Blog <ArrowUpRight />
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <dl className={styles.facts}>
              {profile.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
