import express from 'express';
import { checkMintStatus, mintResidencyNFT } from '../controllers/residencyController.js';

const router = express.Router();

// Check mint status
router.get('/status/:userId', checkMintStatus);

// Mint new residency NFT
router.post('/mint', mintResidencyNFT);

export default router;
