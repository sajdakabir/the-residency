const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: { 
    type: String, 
    required: true, 
    select: false,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  passportNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  country: { type: String, required: true },
  residencyType: { 
    type: String, 
    enum: ['bhutan', 'draper'], 
    required: true 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: Date,
  status: {
    type: String,
    enum: ['active', 'suspended', 'deactivated'],
    default: 'active'
  }
}, { 
  timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user info without sensitive data
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetToken;
  delete user.resetTokenExpiry;
  delete user.verificationToken;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
