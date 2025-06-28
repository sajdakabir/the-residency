import express from 'express';
import { submitKyc, getAllKyc, updateKycStatus } from '../controllers/kycController.js';
// import protect, authorize middlewares as needed

const router = express.Router();

// User routes
router.post('/submit', submitKyc);
router.get('/status/:userId', getKycStatus);

// Admin routes
router.get('/admin', getAllKyc); // list submissions
router.post('/admin/:id/approve', approveKyc);
router.post('/admin/:id/reject', rejectKyc);

export default router;
