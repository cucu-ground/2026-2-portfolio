import { Schema, model, models } from 'mongoose';

const skillGroupSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    items: [{ _id: false, name: String }],
  },
  { timestamps: true },
);

export const SkillGroupModel = models.SkillGroup || model('SkillGroup', skillGroupSchema);
