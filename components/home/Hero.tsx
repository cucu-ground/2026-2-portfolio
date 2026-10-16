import Link from 'next/link';
import type { Profile, Project } from '@/lib/types';
import { Terminal } from '../Terminal';
import { ArrowRight, ArrowUpRight, GitHub } from '../icons';
import styles from './home.module.css';

export function Hero({ profile, projects }: { profile: Profile; projects: Pick<Project, 'slug' | 'title'>[] }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className="container">
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.heroSub}>
              {profile.tagline} · {profile.handle}
            </p>
            <h1 id="hero-title" className={styles.heroTitle}>
              {profile.headline.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
              <em>{profile.headlineEm}</em>
              {profile.headlineTail}
            </h1>
            <p className={styles.heroDesc}>{profile.summary}</p>
            <div className={styles.heroCtas}>
              <Link href="/#projects" className="btn btn-primary">
                프로젝트 보기 <ArrowRight />
              </Link>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn">
                <GitHub /> GitHub
              </a>
              <a href={profile.links.blog} target="_blank" rel="noopener noreferrer" className="btn">
                Blog <ArrowUpRight />
              </a>
            </div>
          </div>

          <aside className={styles.status} aria-label="현재 진행 중인 일">
            <p className={styles.statusHead}>
              <b>$</b> status --now
            </p>
            <ul className={styles.statusList}>
              {profile.now.map((item) => {
                const body = (
                  <>
                    <span className="dot dot-live" aria-hidden />
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </>
                );
                return (
                  <li key={item.label}>{item.href ? <Link href={item.href}>{body}</Link> : <div>{body}</div>}</li>
                );
              })}
            </ul>
          </aside>
        </div>

        <div className={styles.heroTerminal}>
          <Terminal
            projects={projects.map((p) => ({ slug: p.slug, title: p.title }))}
            links={{
              github: profile.links.github,
              blog: profile.links.blog,
              repo: profile.course.repoUrl,
              demo: profile.course.demoUrl,
            }}
            whoami={`${profile.handle} · ${profile.tagline}\n${profile.summary}`}
            about={profile.about.join('\n\n')}
          />
        </div>

        <a href="#about" className={styles.scrollHint}>
          scroll ↓
        </a>
      </div>
    </section>
  );
}
