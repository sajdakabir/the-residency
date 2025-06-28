import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  url: string;
  type: 'passport' | 'id_card' | 'proof_of_address' | 'photo' | 'other';
  mimeType: string;
  size: number;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  metadata?: Record<string, any>;
  tags?: string[];
  isPublic: boolean;
  expiresAt?: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ['passport', 'id_card', 'proof_of_address', 'photo', 'other'],
      required: true,
    },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    rejectionReason: String,
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    metadata: { type: Schema.Types.Mixed },
    tags: [String],
    isPublic: { type: Boolean, default: false },
    expiresAt: Date,
  },
  { timestamps: true }
);

// Indexes for faster querying
documentSchema.index({ user: 1, type: 1 });
documentSchema.index({ user: 1, status: 1 });
documentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // For TTL

const Document = mongoose.model<IDocument>('Document', documentSchema);

export default Document;
