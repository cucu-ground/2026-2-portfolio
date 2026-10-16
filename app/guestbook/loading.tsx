export default function GuestbookLoading() {
  return (
    <div className="container" style={{ paddingTop: 'calc(var(--header-h) + 72px)', paddingBottom: 96 }} aria-busy>
      <p className="sr-only">방명록을 불러오는 중입니다.</p>
      <div className="skeleton" style={{ width: 260, height: 40, marginBottom: 20 }} />
      <div className="skeleton" style={{ width: '50%', height: 20, marginBottom: 56 }} />
      <div style={{ display: 'grid', gap: 12 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 96 }} />
        ))}
      </div>
    </div>
  );
}
