import { Schema, model, models } from 'mongoose';

// 콘텐츠 동기화 버전 기록 (key: 'content')
const metaSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    version: String,
    syncedAt: Date,
  },
  { timestamps: true },
);

export const MetaModel = models.Meta || model('Meta', metaSchema);
