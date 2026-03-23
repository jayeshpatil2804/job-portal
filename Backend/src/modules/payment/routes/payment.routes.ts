import { Router } from 'express'
import { createOrder, verifyPayment, getPaymentHistory } from '../controllers/payment.controller'
import { protect } from '../../auth/middleware/auth.middleware'

const router = Router()

// All payment routes require authentication
router.post('/create-order', protect, createOrder)
router.post('/verify-payment', protect, verifyPayment)
router.get('/history', protect, getPaymentHistory)

export default router 
