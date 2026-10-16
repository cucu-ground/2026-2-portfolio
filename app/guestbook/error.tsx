'use client';

import { useEffect } from 'react';

// Next.js 16.3: 에러 경계는 retry()로 다시 불러온다 (reset은 다시 가져오지 않음)
export default function GuestbookError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container" style={{ padding: 'calc(var(--header-h) + 96px) var(--gutter) 120px', textAlign: 'center' }}>
      <p className="kicker" style={{ marginBottom: 8 }}>
        guestbook: connection failed
      </p>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>방명록을 불러오지 못했습니다.</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
        일시적인 DB 연결 문제일 수 있어요. 잠시 후 다시 시도해주세요.
        {error.digest && ` (참고번호: ${error.digest})`}
      </p>
      <button type="button" className="btn btn-primary" onClick={() => retry()}>
        다시 시도
      </button>
    </div>
  );
}
