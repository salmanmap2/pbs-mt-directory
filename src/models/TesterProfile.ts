import mongoose, { Schema, model, models } from 'mongoose';

const TesterProfileSchema = new Schema(
  {
    profilePic: { type: String },
    fullName: { type: String, required: true },
    post: { type: String, enum: ['Meter Tester', 'Meter Testing Supervisor'], required: true },
    pbs: { type: String, required: true },
    office: { type: String, required: true },
    ownDistrict: { type: String, required: true },
    transferChoice1: { type: String },
    transferChoice2: { type: String },
    transferChoice3: { type: String },
    mobileNumber: { type: String, required: true, unique: true },
    whatsappNumber: { type: String },
    facebookUrl: { type: String },
    joiningDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TesterProfileSchema.index({ updatedAt: 1 });

export default models.TesterProfile || model('TesterProfile', TesterProfileSchema);
