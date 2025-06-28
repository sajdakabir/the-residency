import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  logout, 
  protect 
} from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes (require authentication)
router.get('/me', protect, getMe);

export default router;
