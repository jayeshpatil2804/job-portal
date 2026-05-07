import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getAllRecruiters = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        const [recruiters, total] = await Promise.all([
            prisma.recruiter.findMany({
                include: {
                    profile: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.recruiter.count()
        ])

        const now = new Date()

        res.json({
            success: true,
            recruiters: recruiters.map(r => ({
                id: r.id,
                company: r.companyName,
                contact: r.fullName,
                status: r.verificationStatus,
                isActive: (r as any).isActive,
                appliedOn: r.createdAt.toLocaleDateString(),
                mobile: r.mobile
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch recruiters' })
    }
}

export const updateRecruiterStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const { status } = req.body // APPROVED or REJECTED or PENDING

        await prisma.recruiter.update({
            where: { id },
            data: { verificationStatus: status }
        })

        res.json({
            success: true,
            message: `Recruiter status updated to ${status} successfully`
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update recruiter status' })
    }
}

export const getAllCandidates = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        const [candidates, total] = await Promise.all([
            prisma.candidate.findMany({
                include: {
                    profile: true,
                    applications: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.candidate.count()
        ])

        const now = new Date()

        res.json({
            success: true,
            candidates: candidates.map(c => ({
                id: c.id,
                name: c.fullName,
                email: c.email,
                phone: c.mobile,
                location: (c as any).city || 'N/A',
                role: c.profile?.department || 'Candidate',
                experience: c.profile?.yearsOfExp || '0',
                skills: (c.profile?.skills ? c.profile.skills.split(',') : []) as string[],
                applied: c.applications.length,
                isActive: (c as any).isActive,
                isVerified: c.isVerified,
                avatar: (c.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'NA') as string
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch candidates' })
    }
}

export const toggleRecruiterActivation = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const { isActive } = req.body

        await prisma.recruiter.update({
            where: { id },
            data: { isActive: Boolean(isActive) } as any
        })

        if ((req as any).io) {
            (req as any).io.to(id).emit('accountStatusChanged', { isActive: Boolean(isActive) })
        }

        res.json({
            success: true,
            message: `Recruiter activation status set to ${isActive}`
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update recruiter activation status' })
    }
}

export const toggleCandidateActivation = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const { isActive } = req.body

        await prisma.candidate.update({
            where: { id },
            data: { isActive: Boolean(isActive) } as any
        })

        if ((req as any).io) {
            (req as any).io.to(id).emit('accountStatusChanged', { isActive: Boolean(isActive) })
        }

        res.json({
            success: true,
            message: `Candidate activation status set to ${isActive}`
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update candidate activation status' })
    }
}


export const getCandidateProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string

        const candidate = await prisma.candidate.findUnique({
            where: { id },
            include: {
                profile: true,
                applications: {
                    include: {
                        job: true
                    }
                },

            }
        })

        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' })
        }



        res.json({
            success: true,
            candidate: {
                id: candidate.id,
                fullName: candidate.fullName,
                email: candidate.email,
                mobile: candidate.mobile,
                role: candidate.role,
                isVerified: candidate.isVerified,
                profile: candidate.profile,
                applications: candidate.applications,
                createdAt: candidate.createdAt.toLocaleDateString(),
                updatedAt: candidate.updatedAt.toLocaleDateString()
            }
        })
    } catch (error) {
        console.error('Get candidate profile error:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch candidate profile' })
    }
}

export const getRecruiterProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string

        const recruiter = await prisma.recruiter.findUnique({
            where: { id },
            include: {
                profile: true,
                jobs: {
                    orderBy: { createdAt: 'desc' }
                },

            }
        })

        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter not found' })
        }



        res.json({
            success: true,
            recruiter: {
                id: recruiter.id,
                fullName: recruiter.fullName,
                email: recruiter.email,
                companyName: recruiter.companyName,
                mobile: recruiter.mobile,
                role: recruiter.role,
                verificationStatus: recruiter.verificationStatus,
                profile: recruiter.profile,
                jobs: recruiter.jobs,
                createdAt: recruiter.createdAt.toLocaleDateString(),
                updatedAt: recruiter.updatedAt.toLocaleDateString()
            }
        })
    } catch (error) {
        console.error('Get recruiter profile error:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch recruiter profile' })
    }
}

export const getCandidateOtp = async (req: Request, res: Response) => {
    try {
        const email = req.params.email as string
        
        const otp = await prisma.otpCode.findFirst({
            where: { 
                email,
                role: 'CANDIDATE'
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!otp) {
            return res.status(404).json({ success: false, message: 'No OTP found for this candidate' })
        }

        res.json({
            success: true,
            otp: otp.code,
            expiresAt: otp.expiresAt
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch candidate OTP' })
    }
}

export const regenerateCandidateOtp = async (req: Request, res: Response) => {
    try {
        const email = req.params.email as string
        const newCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        await prisma.otpCode.create({
            data: {
                email,
                code: newCode,
                role: 'CANDIDATE',
                expiresAt
            }
        })

        res.json({
            success: true,
            message: 'New OTP generated successfully',
            otp: newCode
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to regenerate OTP' })
    }
}

export const getRecruiterOtp = async (req: Request, res: Response) => {
    try {
        const email = req.params.email as string
        
        const otp = await prisma.otpCode.findFirst({
            where: { 
                email,
                role: 'RECRUITER'
            },
            orderBy: { createdAt: 'desc' }
        })

        if (!otp) {
            return res.status(404).json({ success: false, message: 'No OTP found for this recruiter' })
        }

        res.json({
            success: true,
            otp: otp.code,
            expiresAt: otp.expiresAt
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch recruiter OTP' })
    }
}

export const regenerateRecruiterOtp = async (req: Request, res: Response) => {
    try {
        const email = req.params.email as string
        const newCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        await prisma.otpCode.create({
            data: {
                email,
                code: newCode,
                role: 'RECRUITER',
                expiresAt
            }
        })

        res.json({
            success: true,
            message: 'New OTP generated successfully',
            otp: newCode
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to regenerate OTP' })
    }
}

