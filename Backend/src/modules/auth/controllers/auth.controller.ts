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
