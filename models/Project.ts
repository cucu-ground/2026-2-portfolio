import { Schema, model, models } from 'mongoose';

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    title: { type: String, required: true },
    tags: [String],
    description: { type: String, default: '' },
    results: [String],
    images: [{ _id: false, src: String, alt: String, width: Number, height: Number }],
    // 방문자가 누른 좋아요 수 (콘텐츠 동기화 때 덮어쓰지 않음)
    likes: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export const ProjectModel = models.Project || model('Project', projectSchema);
