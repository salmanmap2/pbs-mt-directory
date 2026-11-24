import mongoose, { Schema, model, models } from 'mongoose';

const VacantPostSchema = new Schema(
  {
    pbs: { type: String, required: true },
    office: { type: String, required: true },
    post: { type: String, required: true },
    vacantCount: { type: Number, default: 1 },
    note: { type: String },
  },
  { timestamps: true }
);

export default models.VacantPost || model('VacantPost', VacantPostSchema);