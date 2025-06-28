import asyncHandler from 'express-async-handler';
import Kyc from '../models/Kyc.js';
import User from '../models/User.js';

// @desc    Submit KYC data
// @route   POST /api/kyc/submit
// @access  Public (or Protected if needed)
export const submitKyc = asyncHandler(async (req, res) => {
  const { fullName, email, address, country, passportNumber } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    // Only create user if we have passportNumber to avoid unique constraint
    if (!passportNumber) {
      throw new Error('Passport number is required for new user registration');
    }
    
    user = await User.create({
      fullName,
      email,
      password: "123fmnseb",
      passportNumber,  // Include passportNumber for new users
      status: 'active'
    });
    
  } else if (passportNumber) {
    // Update existing user's passport number if provided
    user.passportNumber = passportNumber;
    await user.save();
  }

  const selfieUrl = req.files?.selfie?.[0]?.path;

  const kyc = await Kyc.create({
    fullName,
    email,
    passportNumber,
    selfieUrl,
    address,
    country,
    user: user._id,
    status: 'pending',
  });

  res.status(201).json({ message: 'KYC submitted', kycId: kyc._id, userId: user._id });
});

// @desc   Get all KYC submissions (admin)
// @route  GET /api/kyc
export const getKycStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const kyc = await Kyc.findOne({ user: userId });
  if (!kyc) return res.status(404).json({ status: 'not_found' });
  res.json({ status: kyc.status });
});

export const getAllKyc = asyncHandler(async (req, res) => {
  const list = await Kyc.find().sort({ createdAt: -1 });
  res.json(list);
});

// @desc   Approve / Reject KYC
// @route  PUT /api/kyc/:id
export const updateKycStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // expected 'approved' or 'rejected'
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const kyc = await Kyc.findById(req.params.id);
  if (!kyc) {
    return res.status(404).json({ message: 'Not found' });
  }
  kyc.status = status;
  await kyc.save();
  res.json({ message: `KYC ${status}`, kyc });
});

export const approveKyc = asyncHandler(async (req, res) => {
  req.body.status = 'approved';
  return updateKycStatus(req, res);
});

export const rejectKyc = asyncHandler(async (req, res) => {
  req.body.status = 'rejected';
  return updateKycStatus(req, res);
});
