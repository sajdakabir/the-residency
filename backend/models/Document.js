const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    index: true
  },
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  // URL to the file in storage (S3, local filesystem, etc.)
  url: { 
    type: String, 
    required: true 
  },
  // File metadata
  type: {
    type: String,
    enum: ['passport', 'id_card', 'proof_of_address', 'photo', 'other'],
    required: true,
  },
  mimeType: { 
    type: String, 
    required: true 
  },
  size: { 
    type: Number, 
    required: true 
  },
  // Document status
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending',
  },
  // Rejection details if document is rejected
  rejectionReason: String,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: Date,
  // Verification details
  verifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  verifiedAt: Date,
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  tags: [String],
  // Access control
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  // For documents that expire (like temporary uploads)
  expiresAt: {
    type: Date,
    index: { expires: 0 } // Automatically remove document when expiresAt is reached
  },
  // For versioning
  isLatest: {
    type: Boolean,
    default: true
  },
  previousVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  // For audit trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true 
});

// Indexes for faster querying
documentSchema.index({ user: 1, type: 1 });
documentSchema.index({ user: 1, status: 1 });
documentSchema.index({ application: 1, status: 1 });
documentSchema.index({ isPublic: 1 });
documentSchema.index({ tags: 1 });

// Text index for search
documentSchema.index(
  { 
    name: 'text',
    description: 'text',
    tags: 'text',
    'metadata.text': 'text'
  },
  {
    weights: {
      name: 10,
      description: 5,
      tags: 3,
      'metadata.text': 1
    }
  }
);

// Pre-save hook to handle versioning
documentSchema.pre('save', async function(next) {
  if (this.isNew && this.previousVersion) {
    // If this is an update to an existing document, mark the previous version as not latest
    await this.constructor.updateOne(
      { _id: this.previousVersion },
      { $set: { isLatest: false } }
    );
  }
  next();
});

// Soft delete method
documentSchema.methods.softDelete = async function(userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

// Restore method
documentSchema.methods.restore = async function() {
  this.isDeleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
