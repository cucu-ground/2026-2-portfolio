import { getGuestbookEntries } from '@/lib/guestbook';
import { formatDate } from '@/lib/format';
import styles from './guestbook.module.css';

// 실패하면 가장 가까운 error.tsx(app/guestbook/error.tsx)가 대신 보여진다.
export async function GuestbookList() {
  const { entries, total } = await getGuestbookEntries(50);

  return (
    <div>
      <div className={styles.listHead}>
        <h2 className="kicker">
          {total}개의 글{total > entries.length && ` · 최근 ${entries.length}개`}
        </h2>
      </div>
      {entries.length === 0 ? (
        <p className="notice">아직 남겨진 글이 없어요. 첫 번째 글을 남겨주세요!</p>
      ) : (
        <ol className={styles.entries}>
          {entries.map((e) => (
            <li key={e.id} className={styles.entry}>
              <div className={styles.entryMeta}>
                <b>{e.name}</b>
                <time dateTime={e.createdAt}>{formatDate(e.createdAt)}</time>
              </div>
              <p>{e.message}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
