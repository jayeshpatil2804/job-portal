import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../../../config/db'
import { generateToken } from '../../../utils/jwt'
import { generateOtp, sendOtpEmail } from '../../../utils/mailer'

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullName, email, mobile, password } = req.body
        // Check if candidate exists
        const existingCandidate = await prisma.candidate.findUnique({ where: { email } })
        if (existingCandidate) {
            return res.status(400).json({ message: 'User already exists with this email' })
        }
        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        // Create candidate record
        const candidate = await prisma.candidate.create({
            data: {
                email,
                fullName,
                mobile,
                password: hashedPassword,
                isVerified: false
            }
        })

        // Generate OTP
        const otp = generateOtp()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        await prisma.otpCode.create({
            data: {
                email,
                code: otp,
                role: 'CANDIDATE',
                expiresAt
            }
        })

        // Send Email (Mocked)
        await sendOtpEmail(email, otp)

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify the OTP sent to your email to complete registration.',
            user: {
                id: candidate.id,
                email: candidate.email,
                fullName: candidate.fullName,
                mobile: candidate.mobile,
                role: candidate.role
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error during signup' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const candidate = await prisma.candidate.findUnique({
            where: { email }
        })
        if (!candidate) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, candidate.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Optional: Require verification before login
        // if (!candidate.isVerified) {
        //     return res.status(401).json({ message: 'Please verify your email first' })
        // }

        const token = generateToken(candidate.id, candidate.role)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: candidate.id,
                email: candidate.email,
                fullName: candidate.fullName,
                mobile: candidate.mobile,
                role: candidate.role,
                isProfileCompleted: candidate.isProfileCompleted
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error during login' })
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        const candidate = await prisma.candidate.findUnique({
            where: { email }
        })
        if (!candidate) return res.status(404).json({ message: 'User not found' })

        // Generate OTP
        const otp = generateOtp()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        await prisma.otpCode.create({
            data: {
                email,
                code: otp,
                role: 'CANDIDATE',
                expiresAt
            }
        })

        await sendOtpEmail(email, otp)

        res.json({ message: 'OTP sent to email for password reset' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body

        const otpRecord = await prisma.otpCode.findFirst({
            where: {
                email,
                code: otp,
                role: 'CANDIDATE',
                expiresAt: { gt: new Date() } // not expired
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' })
        }

        // Mark user verified if this was a signup verification
        const candidate = await prisma.candidate.update({
            where: { email },
            data: { isVerified: true }
        })

        const token = generateToken(candidate.id, candidate.role)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        res.json({
            success: true,
            message: 'OTP verified successfully and logged in',
            user: {
                id: candidate.id,
                email: candidate.email,
                role: candidate.role,
                isProfileCompleted: candidate.isProfileCompleted
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body

        // Verify OTP
        const otpRecord = await prisma.otpCode.findFirst({
            where: {
                email,
                code: otp,
                role: 'CANDIDATE',
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await prisma.candidate.update({
            where: { email },
            data: { password: hashedPassword }
        })

        // Delete used OTP
        await prisma.otpCode.delete({ where: { id: otpRecord.id } })

        res.json({
            success: true,
            message: 'Password reset successful'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token')
        res.json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const resendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        const candidate = await prisma.candidate.findUnique({ where: { email } })
        if (!candidate) return res.status(404).json({ message: 'User not found' })

        // Generate OTP
        const otp = generateOtp()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        await prisma.otpCode.create({
            data: {
                email,
                code: otp,
                role: 'CANDIDATE',
                expiresAt
            }
        })

        await sendOtpEmail(email, otp)

        res.json({
            success: true,
            message: 'New OTP sent to your email'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}
