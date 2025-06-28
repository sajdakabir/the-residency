import asyncHandler from 'express-async-handler';
import Company from '../models/Company.js';

// @route POST /api/company/register
export const registerCompany = asyncHandler(async (req, res) => {
  const { ownerId, name, registrationNumber, address } = req.body;
  const company = await Company.create({ owner: ownerId, name, registrationNumber, address });
  res.status(201).json(company);
});

// @route GET /api/company/:userId
export const getCompanyByUser = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.params.userId });
  if (!company) return res.status(404).json({ message: 'Company not found' });
  res.json(company);
});
