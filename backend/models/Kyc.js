import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    passportUrl: { type: String }, // path or URL to uploaded passport image
    selfieUrl: { type: String },   // path or URL to uploaded selfie
    address: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Kyc', kycSchema);
