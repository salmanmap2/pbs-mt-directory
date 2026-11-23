import mongoose, { Schema, model, models } from 'mongoose';

const MutualTransferSchema = new Schema(
  {
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    post: { type: String, required: true },
    ownDistrict: { type: String, required: true },
    workingPbs: { type: String, required: true },
    mutualPossiblePbs: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.MutualTransfer || model('MutualTransfer', MutualTransferSchema);