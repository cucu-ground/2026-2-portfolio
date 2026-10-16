import { getRecentCommits } from '@/lib/github';
import { formatDate } from '@/lib/format';
import styles from './CommitList.module.css';

// GitHub API 호출 결과를 기다리는 동안 페이지의 나머지는 먼저 보이도록 Suspense 안에서 렌더링된다.
export async function CommitList({ repo, repoUrl }: { repo: string; repoUrl: string }) {
  const commits = await getRecentCommits(repo, 5);

  if (!commits || commits.length === 0) {
    return (
      <p className="notice">
        지금은 GitHub에서 커밋 목록을 불러오지 못했어요.{' '}
        <a href={`${repoUrl}/commits`} target="_blank" rel="noopener noreferrer" className="text-link">
          GitHub에서 보기
        </a>
      </p>
    );
  }

  return (
    <ol className={styles.list}>
      {commits.map((c) => (
        <li key={c.sha}>
          <a href={c.url} target="_blank" rel="noopener noreferrer">
            <code>{c.sha}</code>
            <span className={styles.msg}>{c.message}</span>
            <time dateTime={c.date}>{formatDate(c.date)}</time>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function CommitListSkeleton() {
  return (
    <div aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton" style={{ height: 22, marginBottom: 12 }} />
      ))}
    </div>
  );
}
