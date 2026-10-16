import { Schema, model, models } from 'mongoose';

const guestbookEntrySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 20 },
    message: { type: String, required: true, trim: true, maxlength: 300 },
  },
  { timestamps: true },
);

guestbookEntrySchema.index({ createdAt: -1 });

export const GuestbookEntryModel = models.GuestbookEntry || model('GuestbookEntry', guestbookEntrySchema);
