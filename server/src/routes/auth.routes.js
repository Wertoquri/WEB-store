import express from 'express';
import { register, login, getProfile, updateProfile, googleAuth, facebookAuth, changePassword } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { loginRateLimiter, recordFailedAttempt } from '../middleware/security.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginRateLimiter, login, recordFailedAttempt);
router.post('/google', googleAuth);
router.post('/facebook', facebookAuth);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/change-password', authMiddleware, changePassword);

export default router;
