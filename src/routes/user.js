import express from 'express';
import { registerUser, loginUser, getProfile } from '../controller/user.js';
import { authenticateToken } from '../middleware/user.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/profile', authenticateToken, getProfile);

export default router;
