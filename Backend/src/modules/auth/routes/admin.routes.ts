import { Router } from 'express';
import { login, forgotPassword, verifyOtp, resetPassword, logout, getMe } from '../controllers/admin.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { 
    adminLoginSchema,
    forgotPasswordSchema,
    verifyOtpSchema,
    resetPasswordSchema
} from '../validations/auth.validation';

const router = Router();

router.post('/login', validate(adminLoginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/logout', logout);

// Protected routes (Admin only)
router.get('/me', protect, restrictTo('ADMIN'), getMe);

export default router;
