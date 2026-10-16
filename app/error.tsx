'use client';

import { useEffect } from 'react';

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container" style={{ padding: 'calc(var(--header-h) + 120px) var(--gutter) 140px', textAlign: 'center' }}>
      <p className="kicker" style={{ marginBottom: 8 }}>
        error{error.digest ? ` · ${error.digest}` : ''}
      </p>
      <h1 style={{ fontSize: 26, marginBottom: 12 }}>페이지를 불러오는 중 문제가 생겼어요.</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>잠시 후 다시 시도해주세요.</p>
      <button type="button" className="btn btn-primary" onClick={() => retry()}>
        다시 시도
      </button>
    </div>
  );
}
