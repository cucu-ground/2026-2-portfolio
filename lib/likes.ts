import { cookies } from 'next/headers';

export const LIKED_COOKIE = 'liked_projects';
export const SLUG_PATTERN = /^[a-z0-9-]{1,64}$/;

// 이 브라우저가 좋아요를 누른 프로젝트 slug 목록 (httpOnly 쿠키)
export async function readLikedSlugs(): Promise<string[]> {
  const store = await cookies();
  try {
    const parsed: unknown = JSON.parse(store.get(LIKED_COOKIE)?.value ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === 'string' && SLUG_PATTERN.test(s))
      : [];
  } catch {
    return [];
  }
}
