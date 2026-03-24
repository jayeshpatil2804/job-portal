import { Request, Response } from 'express'
import razorpay from '../../../config/razorpay'
import prisma from '../../../config/db'
import crypto from 'crypto'

// Fixed Amounts (in INR) - Annual subscription fee
const CANDIDATE_VERIFICATION_FEE = 299 // ₹299/year
const RECRUITER_VERIFICATION_FEE = 1199 // ₹1199/year

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { role, id: userId } = (req as any).user // Match auth middleware property 'id'
        
        const amount = role === 'CANDIDATE' ? CANDIDATE_VERIFICATION_FEE : RECRUITER_VERIFICATION_FEE
        
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)

        // Save order to DB
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

        const { id: userId, role } = (req as any).user // Match auth middleware property 'id'

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

        // Update User status (Only mark as paid, admin will set isActive=true)
        if (role === 'CANDIDATE') {
            await prisma.candidate.update({
                where: { id: userId },
                data: { isPaid: true } 
            })
        } else if (role === 'RECRUITER') {
            await prisma.recruiter.update({
                where: { id: userId },
                data: { isPaid: true } 
            })
        }

        res.json({
            success: true,
            message: 'Payment verified successfully',
            paymentId: razorpay_payment_id
        })
    } catch (error) {
        console.error('Verify payment error:', error)
        res.status(500).json({ success: false, message: 'Payment verification failed' })
    }
}

export const getPaymentHistory = async (req: Request, res: Response) => {
    try {
        const { id: userId, role } = (req as any).user // Match auth middleware property 'id'
        
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
