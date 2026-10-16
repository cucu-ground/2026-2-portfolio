import { Schema, model, models } from 'mongoose';

const activitySchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    category: { type: String, enum: ['external', 'contest', 'campus', 'ctf'], required: true },
    title: { type: String, required: true },
    period: { type: String, default: '' },
    sortKey: { type: String, default: '' },
    ongoing: { type: Boolean, default: false },
    description: { type: String, default: '' },
    projectSlug: String,
  },
  { timestamps: true },
);

export const ActivityModel = models.Activity || model('Activity', activitySchema);
