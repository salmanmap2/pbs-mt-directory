import { Schema, model, models } from 'mongoose';

const DeviceUpdateLogSchema = new Schema({
  deviceId: { type: String, required: true, index: true },
  mobileNumber: { type: String },
  dateKey: { type: String },
});

DeviceUpdateLogSchema.index({ deviceId: 1, dateKey: 1 }, { unique: true });

export default models.DeviceUpdateLog || model('DeviceUpdateLog', DeviceUpdateLogSchema);
