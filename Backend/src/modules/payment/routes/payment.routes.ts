import { Router } from 'express'
import {
    createOrder,
    verifyPayment,
    getPaymentHistory,
    getSubscriptionStatus,
    getNotifications,
    markNotificationRead
} from '../controllers/payment.controller'
import { protect } from '../../auth/middleware/auth.middleware'

const router = Router()

// All payment routes require authentication
router.post('/create-order', protect, createOrder)
router.post('/verify-payment', protect, verifyPayment)
router.get('/history', protect, getPaymentHistory)

// Subscription status (for users to check their own subscription)
router.get('/subscription-status', protect, getSubscriptionStatus)

// Notifications
router.get('/notifications', protect, getNotifications)
router.patch('/notifications/:id/read', protect, markNotificationRead)

export default router
