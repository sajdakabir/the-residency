import mongoose from 'mongoose';

const coFounderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { _id: true });

const companySchema = new mongoose.Schema(
  {
    // Basic Company Info
    companyName: { type: String, required: true },
    companyType: { 
      type: String, 
      required: true,
      enum: ['LLC', 'DAO', 'SoloOp', 'Co-operative']
    },
    businessActivity: { type: String, required: true },
    jurisdiction: { 
      type: String, 
      default: 'Bhutan',
      enum: ['Bhutan', 'Future']
    },
    virtualOfficeOptIn: { type: Boolean, default: false },
    
    // Ownership & Control
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerDirector: { type: String, required: true },
    coFounders: [coFounderSchema],
    governanceModel: { 
      type: String, 
      required: true,
      enum: ['Centralized', 'Multi-sig', 'Token Voting']
    },
    
    // Documentation
    bylawsFile: { type: String }, // File path/URL
    termsAccepted: { type: Boolean, required: true, default: false },
    
    // Registration Details
    registrationNumber: { type: String, unique: true },
    taxId: { type: String, unique: true },
    registrationDate: { type: Date, default: Date.now },
    status: { 
      type: String, 
      default: 'Active',
      enum: ['Active', 'Pending', 'Suspended', 'Dissolved']
    },
    
    // Payment Info (for record keeping)
    registrationFee: { type: Number, default: 299.00 },
    processingFee: { type: Number, default: 9.00 },
    virtualOfficeFee: { type: Number, default: 0 },
    totalAmount: { type: Number },
    bitcoinAddress: { type: String },
    paymentConfirmed: { type: Boolean, default: false },
    
    // Legacy fields (keeping for compatibility)
    name: { type: String }, // Will be same as companyName
    address: { type: String }
  },
  { timestamps: true }
);

// Pre-save middleware to generate registration numbers and calculate totals
companySchema.pre('save', function(next) {
  // Generate registration number if not provided
  if (!this.registrationNumber) {
    this.registrationNumber = 'BT-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  
  // Generate tax ID if not provided
  if (!this.taxId) {
    this.taxId = 'TAX-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  
  // Calculate total amount
  this.virtualOfficeFee = this.virtualOfficeOptIn ? 120.00 : 0;
  this.totalAmount = this.registrationFee + this.processingFee + this.virtualOfficeFee;
  
  // Sync legacy name field
  if (this.companyName && !this.name) {
    this.name = this.companyName;
  }
  
  next();
});

export default mongoose.model('Company', companySchema);
