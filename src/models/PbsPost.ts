import mongoose, { Schema, model, models } from 'mongoose';

const PbsPostSchema = new Schema(
  {
    pbsName:        { type: String, required: true, unique: true },
    zonalCount:     { type: Number, default: 0 },
    subZonalCount:  { type: Number, default: 0 },
    totalOfficerMT: { type: Number, default: 0 },
    totalMT:        { type: Number, default: 0 },
    freePost:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.PbsPost || model('PbsPost', PbsPostSchema);