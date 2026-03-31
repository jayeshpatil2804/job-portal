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
                status: r.verificationStatus,
                isPaid: r.isPaid,
                isActive: (r as any).isActive,
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
                skills: (c.profile?.skills ? c.profile.skills.split(',') : []) as string[],
                applied: c.applications.length,
                isPaid: c.isPaid,
                isActive: (c as any).isActive,
                avatar: (c.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'NA') as string
            }))
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

export const updateRecruiterPaymentStatus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const { paymentStatus } = req.body // 'PAID' | 'UNPAID' | 'TEMP_ACTIVATED'

        let updateData: any = {}

        if (paymentStatus === 'PAID') {
            updateData = { isPaid: true, isActive: true }
        } else if (paymentStatus === 'UNPAID') {
            updateData = { isPaid: false, isActive: false }
        } else if (paymentStatus === 'TEMP_ACTIVATED') {
            updateData = { isPaid: false, isActive: true }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid payment status' })
        }

        await prisma.recruiter.update({
            where: { id },
            data: updateData
        })

        if ((req as any).io && updateData.isActive !== undefined) {
             (req as any).io.to(id).emit('accountStatusChanged', { isActive: updateData.isActive })
        }

        res.json({
            success: true,
            message: `Recruiter payment status updated to ${paymentStatus} successfully`
        })
    } catch (error) {
        console.error('Update payment status error:', error)
        res.status(500).json({ success: false, message: 'Failed to update recruiter payment status' })
    }
}
