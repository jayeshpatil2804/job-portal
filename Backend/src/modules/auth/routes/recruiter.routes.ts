import { Router } from 'express'
import {
    signup,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword,
    logout,
    resendOtp
} from '../controllers/recruiter.controller'
import {
    getProfileStatus,
    updateCompanyProfile,
    getCompanyProfile
} from '../controllers/recruiterProfile.controller'
import { protect, restrictTo } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import {
    recruiterSignupSchema,
    recruiterLoginSchema,
    forgotPasswordSchema,
    verifyOtpSchema,
    resetPasswordSchema,
    resendOtpSchema
} from '../validations/auth.validation'

const router = Router()

router.post('/signup', validate(recruiterSignupSchema), signup as any)
router.post('/login', validate(recruiterLoginSchema), login as any)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword as any)
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp as any)
router.post('/reset-password', validate(resetPasswordSchema), resetPassword as any)
router.post('/logout', logout as any)
router.post('/resend-otp', validate(resendOtpSchema), resendOtp as any)

// Protected Recruiter Profile Routes
router.get('/profile-status', protect, restrictTo('RECRUITER'), getProfileStatus as any)
router.post('/complete-profile', protect, restrictTo('RECRUITER'), updateCompanyProfile as any)
router.get('/company-profile', protect, restrictTo('RECRUITER'), getCompanyProfile as any)

export default router
