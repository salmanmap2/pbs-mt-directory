import mongoose, { Schema, model, models } from 'mongoose';

const AppSettingsSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

export default models.AppSettings || model('AppSettings', AppSettingsSchema);