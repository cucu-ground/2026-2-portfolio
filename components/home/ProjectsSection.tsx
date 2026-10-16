import Image from 'next/image';
import type { ProjectWithStats } from '@/lib/types';
import { SectionHead } from '../SectionHead';
import { Reveal } from '../Reveal';
import { LikeButton } from '../LikeButton';
import styles from './home.module.css';

// 기존 포트폴리오와 같은 구성: 번호 · 태그 / 제목 · 설명 · 결과 · 화면
export function ProjectsSection({
  projects,
  likedSlugs,
  likesEnabled,
}: {
  projects: ProjectWithStats[];
  likedSlugs: string[];
  likesEnabled: boolean;
}) {
  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHead index="03" title="Projects." />
        <div className={styles.projects}>
          {projects.map((p, i) => (
            <Reveal as="article" key={p.slug} id={`project-${p.slug}`} className={styles.project}>
              <div className={styles.projLeft}>
                <p className={styles.projNum}>{String(i + 1).padStart(2, '0')}</p>
                <ul className={styles.projTags} aria-label="사용 기술">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={styles.projTitle}>{p.title}</h3>
                <p className={styles.projDesc}>{p.description}</p>
                <ul className={styles.projResults}>
                  {p.results.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                {p.images.length > 0 && (
                  <div className={styles.projShots}>
                    {p.images.map((img) => (
                      <a key={img.src} href={img.src} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          width={img.width}
                          height={img.height}
                          sizes="(max-width: 640px) 100vw, 420px"
                        />
                      </a>
                    ))}
                  </div>
                )}
                <LikeButton
                  slug={p.slug}
                  initialLikes={p.likes}
                  initialLiked={likedSlugs.includes(p.slug)}
                  disabled={!likesEnabled}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
