import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../../../config/db'
import { generateToken } from '../../../utils/jwt'
import { generateOtp, sendOtpEmail } from '../../../utils/mailer'

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const admin = await prisma.admin.findUnique({
            where: { email }
        })

        if (!admin) {
            return res.status(400).json({ message: 'Invalid admin credentials' })
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid admin credentials' })
        }

        const token = generateToken(admin.id, admin.role)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours for admin session
        })

        res.json({
            success: true,
            message: 'Admin login successful',
            user: {
                id: admin.id,
                email: admin.email,
                fullName: admin.fullName,
                role: admin.role,
                isSuperAdmin: admin.isSuperAdmin,
                permissions: admin.permissions
            }
        })
    } catch (error) {
        console.error('Admin login error:', error)
        res.status(500).json({ message: 'Server error during admin login' })
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { adminEmail: email } = req.body

        const admin = await prisma.admin.findUnique({
            where: { email }
        })

        if (!admin) return res.status(404).json({ message: 'Admin not found' })

        // Generate OTP
        const otp = generateOtp()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        await prisma.otpCode.create({
            data: {
                email,
                code: otp,
                role: 'ADMIN',
                expiresAt
            }
        })

        await sendOtpEmail(email, otp)

        res.json({ success: true, message: 'OTP sent to admin email' })
    } catch (error) {
        console.error('Admin forgot password error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { adminEmail: email, otp } = req.body

        const otpRecord = await prisma.otpCode.findFirst({
            where: {
                email,
                code: otp,
                role: 'ADMIN',
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' })
        }

        res.json({
            success: true,
            message: 'OTP verified successfully'
        })
    } catch (error) {
        console.error('Admin OTP verify error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { adminEmail: email, otp, newPassword } = req.body

        const otpRecord = await prisma.otpCode.findFirst({
            where: {
                email,
                code: otp,
                role: 'ADMIN',
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await prisma.admin.update({
            where: { email },
            data: { password: hashedPassword }
        })

        await prisma.otpCode.delete({ where: { id: otpRecord.id } })

        res.json({
            success: true,
            message: 'Admin password reset successful'
        })
    } catch (error) {
        console.error('Admin reset password error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token')
        res.json({
            success: true,
            message: 'Admin logged out successfully'
        })
    } catch (error) {
        console.error('Admin logout error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const getMe = async (req: any, res: Response) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: { id: req.user.id }
        })

        if (!admin) return res.status(404).json({ message: 'Admin not found' })

        res.json({
            success: true,
            user: {
                id: admin.id,
                email: admin.email,
                fullName: admin.fullName,
                role: admin.role,
                isSuperAdmin: admin.isSuperAdmin,
                permissions: admin.permissions
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}
