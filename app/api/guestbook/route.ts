import { NextResponse } from 'next/server';
import { getGuestbookEntries } from '@/lib/guestbook';
import { hasMongoUri } from '@/lib/mongodb';

// GET /api/guestbook — 최근 방명록 20개 (작성은 Server Action으로만 받는다)
export async function GET() {
  if (!hasMongoUri()) {
    return NextResponse.json({ error: 'database not configured' }, { status: 503 });
  }
  try {
    const { entries, total } = await getGuestbookEntries(20);
    return NextResponse.json({ total, entries });
  } catch (err) {
    console.error('[api/guestbook]', err);
    return NextResponse.json({ error: 'failed to load guestbook' }, { status: 500 });
  }
}
