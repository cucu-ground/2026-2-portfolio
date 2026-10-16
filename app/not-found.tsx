import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: 'calc(var(--header-h) + 120px) var(--gutter) 140px' }}>
      <div
        style={{
          maxWidth: 640,
          background: 'var(--term-bg)',
          color: 'var(--term-text)',
          border: '1px solid var(--term-border)',
          borderRadius: 12,
          padding: '20px 22px',
          fontFamily: 'var(--font-mono)',
          fontSize: 15,
          lineHeight: 1.7,
        }}
      >
        <p>
          <span style={{ color: 'var(--term-accent)' }}>C:\cucu\portfolio&gt;</span> cd ./this-page
        </p>
        <p style={{ color: 'var(--term-err)' }}>404: 지정된 경로를 찾을 수 없습니다.</p>
      </div>
      <h1 style={{ fontSize: 26, margin: '32px 0 8px' }}>페이지를 찾을 수 없어요.</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>주소가 바뀌었거나 없는 페이지입니다.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link href="/" className="btn btn-primary">
          홈으로
        </Link>
        <Link href="/#projects" className="btn">
          프로젝트 보기
        </Link>
      </div>
    </div>
  );
}
