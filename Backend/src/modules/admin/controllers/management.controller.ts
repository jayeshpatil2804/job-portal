import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getAllRecruiters = async (req: Request, res: Response) => {
    try {
        const recruiters = await prisma.recruiter.findMany({
            include: {
                profile: true
            },
            orderBy: { createdAt: 'desc' }
        })

        res.json({
            success: true,
            recruiters: recruiters.map(r => ({
                id: r.id,
                company: r.companyName,
                contact: r.fullName,
                email: r.email,
                status: r.verificationStatus,
                isPaid: r.isPaid,
                appliedOn: r.createdAt.toLocaleDateString(),
                mobile: r.mobile
            }))
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
        const candidates = await prisma.candidate.findMany({
            include: {
                profile: true,
                applications: true
            },
            orderBy: { createdAt: 'desc' }
        })

        res.json({
            success: true,
            candidates: candidates.map(c => ({
                id: c.id,
                name: c.fullName,
                email: c.email,
                phone: c.mobile,
                location: c.profile?.city || 'N/A',
                role: c.profile?.designation || 'Candidate',
                experience: c.profile?.yearsOfExp || '0',
                education: c.profile?.qualification || 'N/A',
                skills: (c.profile?.skills ? c.profile.skills.split(',') : []) as string[],
                applied: c.applications.length,
                isPaid: c.isPaid,
                avatar: (c.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'NA') as string
            }))
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch candidates' })
    }
}
