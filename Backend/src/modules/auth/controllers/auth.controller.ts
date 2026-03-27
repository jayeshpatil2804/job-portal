import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getMe = async (req: Request, res: Response) => {
    try {
        const { id, role } = (req as any).user

        let user: any = null

        if (role === 'CANDIDATE') {
            user = await prisma.candidate.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    role: true,
                    isVerified: true,
                    isProfileCompleted: true,
                }
            })
        } else if (role === 'RECRUITER') {
            user = await prisma.recruiter.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    companyName: true,
                    role: true,
                    verificationStatus: true,
                    isProfileCompleted: true,
                }
            })
        } else if (role === 'ADMIN') {
            user = await prisma.admin.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    role: true,
                    isSuperAdmin: true,
                    permissions: true,
                }
            })
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.error('[getMe]', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const getSupportRedirect = async (req: Request, res: Response) => {
    try {
        const { id, role } = (req as any).user
        let fullName = ''
        let mobile = ''

        if (role === 'CANDIDATE') {
            const user = await prisma.candidate.findUnique({ where: { id }, select: { fullName: true, mobile: true } })
            if (user) {
                fullName = user.fullName
                mobile = user.mobile
            }
        } else if (role === 'RECRUITER') {
            const user = await prisma.recruiter.findUnique({ where: { id }, select: { fullName: true, mobile: true } })
            if (user) {
                fullName = user.fullName
                mobile = user.mobile
            }
        }

        const message = `Hello Admin,\n\nI am facing an issue on the Job Portal.\n\n🔹 Name: ${fullName}\n🔹 Registered Mobile Number: ${mobile}\n🔹 User Type: ${role}\n🔹 Issue: \n\nKindly look into this and help me resolve it.\n\nThank you.`
        const whatsappUrl = `https://wa.me/918511952831?text=${encodeURIComponent(message)}`
        
        return res.redirect(whatsappUrl)
    } catch (error) {
        console.error('[getSupportRedirect]', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const getActivationRedirect = async (req: Request, res: Response) => {
    try {
        const { id, role } = (req as any).user
        let message = ''

        if (role === 'CANDIDATE') {
            const user = await prisma.candidate.findUnique({ where: { id }, select: { fullName: true, mobile: true, email: true } })
            if (user) {
                message = `Hello Admin,\n\nI want to activate my profile on the Job Portal.\n\n🔹 Name: ${user.fullName}\n🔹 Mobile Number: ${user.mobile}\n🔹 Email ID: ${user.email}\n🔹 Profile Type: Candidate\n\nKindly share the payment link to proceed with activation.\n\nThank you.`
            }
        } else if (role === 'RECRUITER') {
            const user = await prisma.recruiter.findUnique({ where: { id }, select: { fullName: true, mobile: true, email: true, companyName: true } })
            if (user) {
                message = `Hello Admin,\n\nI would like to activate my Recruiter profile on the Job Portal.\n\n🔹 Company Name: ${user.companyName}\n🔹 Contact Person: ${user.fullName}\n🔹 Mobile Number: ${user.mobile}\n🔹 Email ID: ${user.email}\n🔹 Profile Type: Recruiter\n\nKindly share the payment link for activation.\n\nThank you.`
            }
        }

        if (!message) {
            return res.status(404).json({ message: 'User not found' })
        }

        const whatsappUrl = `https://wa.me/918511952831?text=${encodeURIComponent(message)}`
        return res.redirect(whatsappUrl)
    } catch (error) {
        console.error('[getActivationRedirect]', error)
        return res.status(500).json({ message: 'Server error' })
    }
}
