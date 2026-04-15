import { Request, Response } from 'express'
import razorpay from '../../../config/razorpay'
import prisma from '../../../config/db'
import crypto from 'crypto'

// Fixed Amounts (in INR) - Annual subscription fee
const CANDIDATE_VERIFICATION_FEE = 299 // ₹299/year
const RECRUITER_VERIFICATION_FEE = 1199 // ₹1199/year

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { role, id: userId } = (req as any).user

        const amount = role === 'CANDIDATE' ? CANDIDATE_VERIFICATION_FEE : RECRUITER_VERIFICATION_FEE

        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)

        await prisma.payment.create({
            data: {
                orderId: order.id,
                amount: amount,
                currency: 'INR',
                status: 'PENDING',
                candidateId: role === 'CANDIDATE' ? userId : undefined,
                recruiterId: role === 'RECRUITER' ? userId : undefined,
            }
        })

        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        })
    } catch (error) {
        console.error('Create order error:', error)
        res.status(500).json({ success: false, message: 'Failed to create payment order' })
    }
}

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        const { id: userId, role } = (req as any).user

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex')

        const isAuthentic = expectedSignature === razorpay_signature

        if (!isAuthentic) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' })
        }

        // Update Payment record
        await prisma.payment.update({
            where: { orderId: razorpay_order_id },
            data: {
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                status: 'COMPLETED'
            }
        })

        // Set subscription start and expiry (1 year from now)
        const now = new Date()
        const expiryDate = new Date(now)
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)

        // Update User status
        if (role === 'CANDIDATE') {
            await prisma.candidate.update({
                where: { id: userId },
                data: {
                    isPaid: true,
                    subscriptionStartDate: now,
                    subscriptionExpiryDate: expiryDate,
                } as any
            })
        } else if (role === 'RECRUITER') {
            await prisma.recruiter.update({
                where: { id: userId },
                data: {
                    isPaid: true,
                    subscriptionStartDate: now,
                    subscriptionExpiryDate: expiryDate,
                } as any
            })
        }

        res.json({
            success: true,
            message: 'Payment verified successfully',
            paymentId: razorpay_payment_id,
            subscriptionExpiryDate: expiryDate
        })
    } catch (error) {
        console.error('Verify payment error:', error)
        res.status(500).json({ success: false, message: 'Payment verification failed' })
    }
}

export const getPaymentHistory = async (req: Request, res: Response) => {
    try {
        const { id: userId } = (req as any).user

        const payments = await prisma.payment.findMany({
            where: {
                OR: [
                    { candidateId: userId },
                    { recruiterId: userId }
                ]
            },
            orderBy: { createdAt: 'desc' }
        })

        res.json({ success: true, payments })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch payment history' })
    }
}

// Returns subscription status for logged-in user
export const getSubscriptionStatus = async (req: Request, res: Response) => {
    try {
        const { id: userId, role } = (req as any).user

        let user: any = null

        if (role === 'CANDIDATE') {
            user = await prisma.candidate.findUnique({
                where: { id: userId },
                select: {
                    isPaid: true,
                    isActive: true,
                    subscriptionStartDate: true,
                    subscriptionExpiryDate: true,
                } as any
            })
        } else if (role === 'RECRUITER') {
            user = await prisma.recruiter.findUnique({
                where: { id: userId },
                select: {
                    isPaid: true,
                    isActive: true,
                    subscriptionStartDate: true,
                    subscriptionExpiryDate: true,
                } as any
            })
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const now = new Date()
        const expiryDate: Date | null = (user as any).subscriptionExpiryDate

        let daysRemaining: number | null = null
        let isExpired = false
        let isExpiringSoon = false

        if (expiryDate) {
            const diffMs = expiryDate.getTime() - now.getTime()
            daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
            isExpired = daysRemaining <= 0
            isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30
        }

        res.json({
            success: true,
            isPaid: user.isPaid,
            isActive: user.isActive,
            subscriptionStartDate: (user as any).subscriptionStartDate,
            subscriptionExpiryDate: expiryDate,
            daysRemaining,
            isExpired,
            isExpiringSoon,
        })
    } catch (error) {
        console.error('Get subscription status error:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch subscription status' })
    }
}

// Get notifications for logged-in user
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const { id: userId, role } = (req as any).user

        const whereClause = role === 'CANDIDATE'
            ? { candidateId: userId }
            : { recruiterId: userId }

        const notifications = await prisma.notification.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: 20
        })

        res.json({ success: true, notifications })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' })
    }
}

// Mark notification as read
export const markNotificationRead = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string

        await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        })

        res.json({ success: true, message: 'Notification marked as read' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update notification' })
    }
}
