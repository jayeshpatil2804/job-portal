import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../../../config/db'
import { generateToken } from '../../../utils/jwt'
import { generateOtp, sendOtpEmail } from '../../../utils/mailer'

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullName, companyName, workEmail, mobile, password } = req.body

        // Check if recruiter exists
        const existingRecruiter = await prisma.recruiter.findUnique({ where: { email: workEmail } })
        if (existingRecruiter) {
            return res.status(400).json({ message: 'User already exists with this email' })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create recruiter record
        const recruiter = await prisma.recruiter.create({
            data: {
                email: workEmail,
                fullName,
                companyName,
                mobile,
                password: hashedPassword,
                verificationStatus: 'PENDING'
            }
        })

        // Generate OTP
        const otp = generateOtp()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        await prisma.otpCode.create({
            data: {
                email: workEmail,
                code: otp,
                role: 'RECRUITER',
                expiresAt
            }
        })

        // Send Email (Mocked)
        await sendOtpEmail(workEmail, otp)

        res.status(201).json({
            success: true,
            message: 'Recruiter registered successfully. Please verify the OTP sent to your email to complete registration.',
            user: {
                id: recruiter.id,
                email: recruiter.email,
                fullName: recruiter.fullName,
                companyName: recruiter.companyName,
                mobile: recruiter.mobile,
                role: recruiter.role
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error during signup' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { workEmail, password } = req.body

        const recruiter = await prisma.recruiter.findUnique({
            where: { email: workEmail }
        })
        if (!recruiter) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, recruiter.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Require verification before login
        if (recruiter.verificationStatus !== 'APPROVED') {
            // Generate OTP
            const otp = generateOtp()
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

            await prisma.otpCode.create({
                data: {
                    email: workEmail,
                    code: otp,
                    role: 'RECRUITER',
                    expiresAt
                }
            })

            await sendOtpEmail(workEmail, otp)

            return res.status(403).json({ 
                success: false,
                requiresVerification: true,
                message: 'Email not verified. A new OTP has been sent to your email.' 
            })
        }

        const token = generateToken(recruiter.id, recruiter.role)

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
                id: recruiter.id,
                email: recruiter.email,
                fullName: recruiter.fullName,
                companyName: recruiter.companyName,
                mobile: recruiter.mobile,
                role: recruiter.role
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error during login' })
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { workEmail } = req.body

        const recruiter = await prisma.recruiter.findUnique({
            where: { email: workEmail }
        })
        if (!recruiter) return res.status(404).json({ message: 'Account not found' })

        // Generate OTP
        const otp = generateOtp()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        await prisma.otpCode.create({
            data: {
                email: workEmail,
                code: otp,
                role: 'RECRUITER',
                expiresAt
            }
        })

        await sendOtpEmail(workEmail, otp)

        res.json({ message: 'OTP sent to work email for password reset' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { workEmail, otp } = req.body

        const otpRecord = await prisma.otpCode.findFirst({
            where: {
                email: workEmail,
                code: otp,
                role: 'RECRUITER',
                expiresAt: { gt: new Date() } // not expired
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' })
        }

        // Mark user verified
        const recruiter = await prisma.recruiter.update({
            where: { email: workEmail },
            data: { verificationStatus: 'APPROVED' }
        })

        const token = generateToken(recruiter.id, recruiter.role)

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
                id: recruiter.id,
                email: recruiter.email,
                role: recruiter.role,
                isProfileCompleted: (recruiter as any).isProfileCompleted
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { workEmail, otp, newPassword } = req.body

        // Verify OTP
        const otpRecord = await prisma.otpCode.findFirst({
            where: {
                email: workEmail,
                code: otp,
                role: 'RECRUITER',
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

        await prisma.recruiter.update({
            where: { email: workEmail },
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
        const { workEmail } = req.body

        const recruiter = await prisma.recruiter.findUnique({ where: { email: workEmail } })
        if (!recruiter) return res.status(404).json({ message: 'User not found' })

        // Generate OTP
        const otp = generateOtp()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        await prisma.otpCode.create({
            data: {
                email: workEmail,
                code: otp,
                role: 'RECRUITER',
                expiresAt
            }
        })

        await sendOtpEmail(workEmail, otp)

        res.json({
            success: true,
            message: 'New OTP sent to your work email'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}
