import { Schema, model, models, Types } from 'mongoose';

const UpdateRequestSchema = new Schema({
  testerId: { type: Types.ObjectId, ref: 'TesterProfile' },
  mobileNumber: { type: String },
  deviceId: { type: String },
  proposedChanges: { type: Schema.Types.Mixed },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default models.UpdateRequest || model('UpdateRequest', UpdateRequestSchema);
