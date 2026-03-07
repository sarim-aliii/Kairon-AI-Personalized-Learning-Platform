import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    googleLogin, 
    githubLogin,
    updateUserProfile,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateUserProgress,
    updateUserTodos,
    resendVerificationEmail,
    exportUserData
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/github', githubLogin);

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/progress', protect, updateUserProgress);
router.put('/todos', protect, updateUserTodos);

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerificationEmail);
router.get('/export', protect, exportUserData);

export default router;