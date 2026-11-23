import { Schema, model, models } from 'mongoose';

const DeletedProfileLogSchema = new Schema({
  deletedTesterId: { type: String, required: true },
  deletedAt: { type: Date, default: Date.now },
});

DeletedProfileLogSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export default models.DeletedProfileLog || model('DeletedProfileLog', DeletedProfileLogSchema);
