import { Schema, model, models } from 'mongoose';

// 도배 방지용 기록. IP 원문은 저장하지 않고 salt를 붙인 SHA-256 해시만 저장하며,
// TTL 인덱스로 10분 뒤 MongoDB가 자동 삭제한다.
const rateLimitSchema = new Schema({
  bucket: { type: String, required: true }, // 예: 'guestbook', 'like'
  clientHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

rateLimitSchema.index({ bucket: 1, clientHash: 1, createdAt: -1 });

export const RateLimitModel = models.RateLimit || model('RateLimit', rateLimitSchema);
