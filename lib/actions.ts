'use server';

// Server Action은 브라우저에서 직접 호출할 수 있는 공개 엔드포인트라서
// 화면의 입력 제한(maxLength 등)과 상관없이 여기서 다시 검증한다.

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createGuestbookEntry } from './guestbook';
import { consumeRateLimit } from './rate-limit';
import { connectDB, hasMongoUri } from './mongodb';
import { ProjectModel } from '@/models/Project';
import { MESSAGE_MAX, NAME_MAX } from './limits';
import { LIKED_COOKIE, SLUG_PATTERN, readLikedSlugs } from './likes';

// ---------- 방명록 ----------

export type GuestbookFormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  submittedAt?: number;
  fieldErrors?: { name?: string; message?: string };
  values?: { name: string; message: string };
};

// 제어문자 제거 + 공백 정리 (메시지는 줄바꿈만 허용, 3줄 이상 빈 줄은 2줄로)
function cleanText(value: FormDataEntryValue | null, allowNewline: boolean) {
  const text = typeof value === 'string' ? value.normalize('NFC') : '';
  const withoutControl = allowNewline
    ? text.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').replace(/\n{3,}/g, '\n\n')
    : text.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ');
  return withoutControl.trim();
}

const length = (s: string) => [...s].length;

export async function createGuestbookEntryAction(
  _prev: GuestbookFormState,
  formData: FormData,
): Promise<GuestbookFormState> {
  const name = cleanText(formData.get('name'), false);
  const message = cleanText(formData.get('message'), true);
  const values = { name, message };

  // 사람에게는 보이지 않는 입력칸. 채워져 있으면 봇으로 보고 저장하지 않는다.
  if (cleanText(formData.get('website'), false)) {
    return { status: 'success', message: '방명록이 등록되었습니다.', submittedAt: Date.now() };
  }

  const fieldErrors: GuestbookFormState['fieldErrors'] = {};
  if (!name) fieldErrors.name = '이름을 입력해주세요.';
  else if (length(name) > NAME_MAX) fieldErrors.name = `이름은 ${NAME_MAX}자 이하로 입력해주세요.`;
  if (!message) fieldErrors.message = '메시지를 입력해주세요.';
  else if (length(message) > MESSAGE_MAX) fieldErrors.message = `메시지는 ${MESSAGE_MAX}자 이하로 입력해주세요.`;

  if (fieldErrors.name || fieldErrors.message) {
    return { status: 'error', message: '입력값을 확인해주세요.', fieldErrors, values, submittedAt: Date.now() };
  }

  if (!hasMongoUri()) {
    return { status: 'error', message: '데이터베이스가 연결되지 않아 지금은 작성할 수 없습니다.', values, submittedAt: Date.now() };
  }

  try {
    const allowed = await consumeRateLimit('guestbook', 3);
    if (!allowed) {
      return { status: 'error', message: '도배 방지를 위해 10분에 3개까지 작성할 수 있어요. 잠시 후 다시 시도해주세요.', values, submittedAt: Date.now() };
    }
    await createGuestbookEntry({ name, message });
  } catch (err) {
    console.error('[guestbook] 저장 실패', err);
    return { status: 'error', message: '저장하지 못했습니다. 잠시 후 다시 시도해주세요.', values, submittedAt: Date.now() };
  }

  revalidatePath('/guestbook');
  revalidatePath('/');
  return { status: 'success', message: '방명록이 등록되었습니다. 남겨주셔서 고마워요!', submittedAt: Date.now() };
}

// ---------- 프로젝트 좋아요 ----------

export type LikeResult = { ok: boolean; likes: number; liked: boolean; message?: string };

// 좋아요 / 좋아요 취소 (같은 버튼을 다시 누르면 취소)
export async function toggleLikeAction(slug: string): Promise<LikeResult> {
  if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) {
    return { ok: false, likes: 0, liked: false, message: '잘못된 요청입니다.' };
  }
  if (!hasMongoUri()) {
    return { ok: false, likes: 0, liked: false, message: '데이터베이스가 연결되지 않았습니다.' };
  }

  try {
    await connectDB();
    const likedSlugs = await readLikedSlugs();
    const wasLiked = likedSlugs.includes(slug);

    // 누르기 · 취소 모두 도배 방지 횟수에 포함
    if (!(await consumeRateLimit('like', 30))) {
      return { ok: false, likes: 0, liked: wasLiked, message: '잠시 후 다시 시도해주세요.' };
    }

    type LikesDoc = { likes?: number };
    const options = { returnDocument: 'after' as const, projection: { likes: 1 } };
    let doc: LikesDoc | null;
    if (wasLiked) {
      // 0 아래로는 내려가지 않게, 1 이상일 때만 감소
      doc = await ProjectModel.findOneAndUpdate(
        { slug, likes: { $gt: 0 } },
        { $inc: { likes: -1 } },
        options,
      ).lean<LikesDoc>();
      doc ??= await ProjectModel.findOne({ slug }).select('likes').lean<LikesDoc>();
    } else {
      doc = await ProjectModel.findOneAndUpdate({ slug }, { $inc: { likes: 1 } }, options).lean<LikesDoc>();
    }
    if (!doc) return { ok: false, likes: 0, liked: false, message: '프로젝트를 찾을 수 없습니다.' };

    const nextSlugs = wasLiked ? likedSlugs.filter((s) => s !== slug) : [...likedSlugs, slug].slice(-50);
    const store = await cookies();
    store.set(LIKED_COOKIE, JSON.stringify(nextSlugs), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    revalidatePath('/');
    return { ok: true, likes: doc.likes ?? 0, liked: !wasLiked };
  } catch (err) {
    console.error('[like] 실패', err);
    return { ok: false, likes: 0, liked: false, message: '저장하지 못했습니다.' };
  }
}
