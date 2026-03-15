import { Router } from 'express';
import { signup, login, forgotPassword, verifyOtp, resetPassword, logout, resendOtp } from '../controllers/candidate.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { 
    completeCandidateProfile, 
    getProfileStatus,
    getProfile,
    deleteProfile,
    updateCandidateProfile 
} from '../controllers/profile.controller';
import { validate } from '../middleware/validation.middleware';
import { 
    candidateSignupSchema, 
    candidateLoginSchema,
    forgotPasswordSchema,
    verifyOtpSchema,
    resetPasswordSchema,
    resendOtpSchema
} from '../validations/auth.validation';

const router = Router();

router.post('/signup', validate(candidateSignupSchema), signup);
router.post('/login', validate(candidateLoginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/logout', protect, logout);
router.post('/resend-otp', validate(resendOtpSchema), resendOtp);

// Protected routes (Candidate only)
router.get('/profile-status', protect, restrictTo('CANDIDATE'), getProfileStatus);
router.post('/complete-profile', protect, restrictTo('CANDIDATE'), completeCandidateProfile);
router.get('/profile', protect, restrictTo('CANDIDATE'), getProfile);
router.put('/profile', protect, restrictTo('CANDIDATE'), updateCandidateProfile);
router.delete('/profile', protect, restrictTo('CANDIDATE'), deleteProfile);

export default router;
