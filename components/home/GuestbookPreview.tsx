import Link from 'next/link';
import { getGuestbookEntries } from '@/lib/guestbook';
import { hasMongoUri } from '@/lib/mongodb';
import { formatDate } from '@/lib/format';
import type { GuestbookEntry } from '@/lib/types';
import styles from './home.module.css';

export async function GuestbookPreview() {
  if (!hasMongoUri()) {
    return <p className="notice">데이터베이스가 연결되면 방명록을 볼 수 있어요.</p>;
  }

  let entries: GuestbookEntry[] = [];
  let total = 0;
  try {
    ({ entries, total } = await getGuestbookEntries(3));
  } catch (err) {
    console.error('[guestbook] 미리보기 불러오기 실패', err);
    return <p className="notice">지금은 방명록을 불러오지 못했어요. 잠시 후 다시 확인해주세요.</p>;
  }

  if (entries.length === 0) {
    return (
      <p className="notice">
        아직 남겨진 글이 없어요.{' '}
        <Link href="/guestbook" className="text-link">
          첫 방명록을 남겨주세요
        </Link>
      </p>
    );
  }

  return (
    <>
      <p className="kicker" style={{ marginBottom: 16 }}>
        전체 {total}개 중 최근 {entries.length}개
      </p>
      <ul className={styles.gbGrid}>
        {entries.map((e) => (
          <li key={e.id} className={`card ${styles.gbCard}`}>
            <p className={styles.gbMessage}>{e.message}</p>
            <p className={styles.gbMeta}>
              <b>{e.name}</b>
              <time dateTime={e.createdAt}>{formatDate(e.createdAt)}</time>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function GuestbookPreviewSkeleton() {
  return (
    <div className={styles.gbGrid} aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton" style={{ height: 160 }} />
      ))}
    </div>
  );
}
