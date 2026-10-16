import { Schema, model, models } from 'mongoose';

// 사이트에 하나만 존재하는 프로필 문서 (key: 'main')
const profileSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    handle: String,
    tagline: String,
    headline: [String],
    headlineEm: String,
    headlineTail: String,
    summary: String,
    about: [String],
    facts: [{ _id: false, label: String, value: String }],
    now: [{ _id: false, label: String, detail: String, href: String }],
    links: { github: String, blog: String },
    course: {
      course: String,
      title: String,
      description: String,
      repoUrl: String,
      repoName: String,
      demoUrl: String,
      stack: [String],
      features: [String],
    },
  },
  { timestamps: true },
);

export const ProfileModel = models.Profile || model('Profile', profileSchema);
