import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Kyc', required: true },
    name: { type: String, required: true },
    registrationNumber: String,
    address: String,
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
