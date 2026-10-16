import type { Metadata } from 'next';
import Link from 'next/link';
import { hasMongoUri } from '@/lib/mongodb';
import { SectionHead } from '@/components/SectionHead';
import { GuestbookForm } from '@/components/guestbook/GuestbookForm';
import { GuestbookList } from '@/components/guestbook/GuestbookList';
import { ArrowLeft } from '@/components/icons';
import styles from '@/components/guestbook/guestbook.module.css';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: 'cucu 포트폴리오 방명록',
};

export default function GuestbookPage() {
  const dbReady = hasMongoUri();

  return (
    <>
      <div className="page-head">
        <div className="container">
          <Link href="/" className="back-link">
            <ArrowLeft size={14} /> home
          </Link>
          <SectionHead
            as="h1"
            title="Guestbook."
            desc="포트폴리오를 보고 느낀 점이나 응원을 남겨주세요."
          />
        </div>
      </div>
      <div className={`container ${styles.layout}`}>
        <div className={`card ${styles.formCard}`}>
          {dbReady ? (
            <GuestbookForm />
          ) : (
            <p className="notice">데이터베이스(MONGODB_URI)가 연결되면 방명록을 쓸 수 있어요.</p>
          )}
        </div>
        {dbReady ? <GuestbookList /> : null}
      </div>
    </>
  );
}
