const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: {
    type: String,
    enum: ['visa', 'company_registration', 'residency_renewal', 'other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'in_review', 'approved', 'rejected', 'completed'],
    default: 'draft',
  },
  // General application data
  data: { 
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Application-specific fields
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Documents related to this application
  documents: [documentSchema],
  // Admin/Reviewer fields
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reviewNotes: String,
  reviewedAt: Date,
  // Payment information
  payment: {
    amount: Number,
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    paymentMethod: String,
    paidAt: Date
  },
  // Tracking
  submittedAt: Date,
  completedAt: Date,
  // For applications that require follow-up
  followUpDate: Date,
  isArchived: { type: Boolean, default: false }
}, { 
  timestamps: true 
});

// Indexes for faster querying
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ type: 1, status: 1 });
applicationSchema.index({ 'payment.status': 1 });
applicationSchema.index({ followUpDate: 1 });

// Add a text index for search
applicationSchema.index(
  { 
    'data.fullName': 'text',
    'data.passportNumber': 'text',
    'data.referenceNumber': 'text',
    status: 'text'
  },
  { 
    weights: { 
      'data.fullName': 10,
      'data.passportNumber': 5,
      'data.referenceNumber': 5,
      status: 1
    }
  }
);

// Pre-save hook to handle status changes
applicationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'submitted' && !this.submittedAt) {
    this.submittedAt = new Date();
  }
  
  if (this.isModified('status') && ['approved', 'rejected', 'completed'].includes(this.status)) {
    this.completedAt = new Date();
  }
  
  next();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
