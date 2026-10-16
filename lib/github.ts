export type Commit = { sha: string; message: string; date: string; url: string };

const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;

// 수업 프로젝트 저장소의 최근 커밋을 GitHub API에서 가져온다.
// 30분 동안 Next.js 데이터 캐시에 보관해 API 호출 한도를 아낀다.
export async function getRecentCommits(repo: string, limit = 5): Promise<Commit[] | null> {
  if (!REPO_PATTERN.test(repo)) return null;

  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=${limit}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'cucu-portfolio',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const json: unknown = await res.json();
    if (!Array.isArray(json)) return null;

    return json.slice(0, limit).map((item) => {
      const c = item as { sha?: string; html_url?: string; commit?: { message?: string; author?: { date?: string } } };
      return {
        sha: String(c.sha ?? '').slice(0, 7),
        message: String(c.commit?.message ?? '').split('\n')[0],
        date: String(c.commit?.author?.date ?? ''),
        url: String(c.html_url ?? `https://github.com/${repo}/commits`),
      };
    });
  } catch {
    return null;
  }
}
