import mongoose from 'mongoose';

const residencySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  tokenId: {
    type: String,
    required: true
  },
  contractAddress: {
    type: String,
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  },
  metadata: {
    name: String,
    citizenshipCountry: String,
    eResidencyId: String,
    timestamp: String
  }
}, { timestamps: true });

export default mongoose.models.Residency || mongoose.model('Residency', residencySchema);
