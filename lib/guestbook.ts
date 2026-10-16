import { connection } from 'next/server';
import { connectDB } from './mongodb';
import { GuestbookEntryModel } from '@/models/GuestbookEntry';
import type { GuestbookEntry } from './types';

type EntryDoc = { _id: unknown; name: string; message: string; createdAt?: Date };

function toEntry(doc: EntryDoc): GuestbookEntry {
  return {
    id: String(doc._id),
    name: doc.name,
    message: doc.message,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
  };
}

export async function getGuestbookEntries(limit = 50): Promise<{ entries: GuestbookEntry[]; total: number }> {
  await connection();
  await connectDB();
  const [docs, total] = await Promise.all([
    GuestbookEntryModel.find().sort({ createdAt: -1 }).limit(limit).lean<EntryDoc[]>(),
    GuestbookEntryModel.estimatedDocumentCount(),
  ]);
  return { entries: docs.map(toEntry), total };
}

export async function createGuestbookEntry(input: { name: string; message: string }) {
  await connectDB();
  // 값은 Server Action에서 문자열로 검증한 뒤 넘어온다. 객체를 직접 만들어 넣으므로
  // 사용자 입력이 쿼리 연산자($gt 등)로 해석될 여지가 없다.
  const doc = await GuestbookEntryModel.create({ name: input.name, message: input.message });
  return toEntry(doc);
}
