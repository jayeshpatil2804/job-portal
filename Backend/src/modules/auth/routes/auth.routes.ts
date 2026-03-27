import { Router } from 'express'
import { getMe, getSupportRedirect, getActivationRedirect } from '../controllers/auth.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

router.get('/me', protect, getMe)
router.get('/support/whatsapp', protect, getSupportRedirect)
router.get('/activate/whatsapp', protect, getActivationRedirect)

export default router
