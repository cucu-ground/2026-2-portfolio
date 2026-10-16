import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { connectDB } from './mongodb';
import { RateLimitModel } from '@/models/RateLimit';

const WINDOW_MS = 10 * 60 * 1000;

// 요청한 클라이언트를 IP 해시로 식별한다. (IP 원문은 저장하지 않음)
async function clientHash() {
  const h = await headers();
  const ip = (h.get('x-forwarded-for')?.split(',')[0] ?? h.get('x-real-ip') ?? 'unknown').trim();
  const salt = process.env.RATE_LIMIT_SALT || 'cucu-portfolio';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

// 10분 동안 bucket별 limit회까지 허용. 허용되면 기록을 남기고 true를 반환한다.
export async function consumeRateLimit(bucket: string, limit: number) {
  await connectDB();
  const hash = await clientHash();
  const since = new Date(Date.now() - WINDOW_MS);
  const used = await RateLimitModel.countDocuments({ bucket, clientHash: hash, createdAt: { $gte: since } });
  if (used >= limit) return false;
  await RateLimitModel.create({ bucket, clientHash: hash });
  return true;
}
