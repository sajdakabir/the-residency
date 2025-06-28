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

// @desc   Get KYC status for a user
// @route  GET /api/kyc/status/:userId
// @access Private
export const getKycStatus = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find KYC record for the user
    const kyc = await Kyc.findOne({ user: userId })
      .select('status submittedAt reviewedAt comments')
      .populate('user', 'fullName email');

    if (!kyc) {
      return res.status(200).json({
        success: true,
        data: {
          hasKyc: false,
          status: 'not_submitted',
          message: 'No KYC submission found for this user'
        }
      });
    }

    // Format the response
    const statusInfo = {
      hasKyc: true,
      status: kyc.status || 'pending',
      submittedAt: kyc.submittedAt,
      reviewedAt: kyc.reviewedAt,
      comments: kyc.comments,
      user: kyc.user ? {
        fullName: kyc.user.fullName,
        email: kyc.user.email
      } : null
    };

    res.status(200).json({
      success: true,
      data: statusInfo
    });
    
  } catch (error) {
    console.error('Error getting KYC status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching KYC status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
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
