import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  user: mongoose.Types.ObjectId;
  type: 'visa' | 'company_registration' | 'residency_renewal' | 'other';
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';
  data: Record<string, any>;
  submittedAt: Date;
  updatedAt: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNotes?: string;
  documents: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }>;
}

const applicationSchema = new Schema<IApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['visa', 'company_registration', 'residency_renewal', 'other'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_review', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    data: { type: Schema.Types.Mixed, default: {} },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewNotes: String,
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, required: true },
        size: { type: Number, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster querying
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ type: 1, status: 1 });

const Application = mongoose.model<IApplication>('Application', applicationSchema);

export default Application;
