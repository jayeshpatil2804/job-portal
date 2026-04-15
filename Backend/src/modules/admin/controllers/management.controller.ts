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
            recruiters: recruiters.map(r => {
                const expiry = r.subscriptionExpiryDate ? new Date(r.subscriptionExpiryDate) : null
                const daysRemaining = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
                
                return {
                    id: r.id,
                    company: r.companyName,
                    contact: r.fullName,
                    status: r.verificationStatus,
                    isPaid: r.isPaid,
                    isActive: (r as any).isActive,
                    appliedOn: r.createdAt.toLocaleDateString(),
                    mobile: r.mobile,
                    subscriptionStartDate: r.subscriptionStartDate ? r.subscriptionStartDate.toLocaleDateString() : null,
                    subscriptionExpiryDate: r.subscriptionExpiryDate ? r.subscriptionExpiryDate.toLocaleDateString() : null,
                    subscriptionDaysRemaining: daysRemaining,
                    isExpired: daysRemaining !== null && daysRemaining <= 0,
                    isExpiringSoon: daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30
                }
            }),
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
            candidates: candidates.map(c => {
                const expiry = c.subscriptionExpiryDate ? new Date(c.subscriptionExpiryDate) : null
                const daysRemaining = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
                
                return {
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
                    avatar: (c.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'NA') as string,
                    subscriptionStartDate: c.subscriptionStartDate ? c.subscriptionStartDate.toLocaleDateString() : null,
                    subscriptionExpiryDate: c.subscriptionExpiryDate ? c.subscriptionExpiryDate.toLocaleDateString() : null,
                    subscriptionDaysRemaining: daysRemaining,
                    isExpired: daysRemaining !== null && daysRemaining <= 0,
                    isExpiringSoon: daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30
                }
            }),
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

export const getExpiringSubscriptions = async (req: Request, res: Response) => {
    try {
        const now = new Date()
        const thirtyDaysFromNow = new Date(now)
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

        // Expiring Candidates
        const candidates = await (prisma.candidate as any).findMany({
            where: {
                subscriptionExpiryDate: { lte: thirtyDaysFromNow }
            },
            select: { id: true, fullName: true, email: true, subscriptionExpiryDate: true, isPaid: true }
        })

        // Expiring Recruiters
        const recruiters = await (prisma.recruiter as any).findMany({
            where: {
                subscriptionExpiryDate: { lte: thirtyDaysFromNow }
            },
            select: { id: true, fullName: true, email: true, companyName: true, subscriptionExpiryDate: true, isPaid: true }
        })

        const mappedCandidates = candidates.map((c: any) => {
            const expiry = new Date(c.subscriptionExpiryDate)
            const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            return {
                id: c.id,
                name: c.fullName,
                email: c.email,
                type: 'Candidate',
                expiryDate: expiry.toLocaleDateString(),
                daysRemaining,
                isExpired: daysRemaining <= 0,
                isPaid: c.isPaid
            }
        })

        const mappedRecruiters = recruiters.map((r: any) => {
            const expiry = new Date(r.subscriptionExpiryDate)
            const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            return {
                id: r.id,
                name: r.fullName,
                email: r.email,
                company: r.companyName,
                type: 'Recruiter',
                expiryDate: expiry.toLocaleDateString(),
                daysRemaining,
                isExpired: daysRemaining <= 0,
                isPaid: r.isPaid
            }
        })

        const allExpiring = [...mappedCandidates, ...mappedRecruiters].sort((a, b) => a.daysRemaining - b.daysRemaining)

        res.json({
            success: true,
            data: allExpiring
        })
    } catch (error) {
        console.error('Get expiring subscriptions error:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch expiring subscriptions' })
    }
}

export const renewCandidateSubscription = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const { durationMonths } = req.body // Default 12 months (1 year)

        const months = durationMonths || 12
        const now = new Date()
        const startDate = now
        const expiryDate = new Date(now)
        expiryDate.setMonth(expiryDate.getMonth() + months)

        const updatedCandidate = await prisma.candidate.update({
            where: { id },
            data: {
                isPaid: true,
                isActive: true,
                subscriptionStartDate: startDate,
                subscriptionExpiryDate: expiryDate
            }
        })

        if ((req as any).io) {
            (req as any).io.to(id).emit('accountStatusChanged', { isActive: true })
        }

        res.json({
            success: true,
            message: `Candidate subscription renewed for ${months} months`,
            data: {
                id: updatedCandidate.id,
                email: updatedCandidate.email,
                subscriptionStartDate: startDate.toLocaleDateString(),
                subscriptionExpiryDate: expiryDate.toLocaleDateString(),
                daysRemaining: Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            }
        })
    } catch (error) {
        console.error('Renew candidate subscription error:', error)
        res.status(500).json({ success: false, message: 'Failed to renew candidate subscription' })
    }
}

export const renewRecruiterSubscription = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const { durationMonths } = req.body // Default 12 months (1 year)

        const months = durationMonths || 12
        const now = new Date()
        const startDate = now
        const expiryDate = new Date(now)
        expiryDate.setMonth(expiryDate.getMonth() + months)

        const updatedRecruiter = await prisma.recruiter.update({
            where: { id },
            data: {
                isPaid: true,
                isActive: true,
                subscriptionStartDate: startDate,
                subscriptionExpiryDate: expiryDate
            }
        })

        if ((req as any).io) {
            (req as any).io.to(id).emit('accountStatusChanged', { isActive: true })
        }

        res.json({
            success: true,
            message: `Recruiter subscription renewed for ${months} months`,
            data: {
                id: updatedRecruiter.id,
                email: updatedRecruiter.email,
                subscriptionStartDate: startDate.toLocaleDateString(),
                subscriptionExpiryDate: expiryDate.toLocaleDateString(),
                daysRemaining: Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            }
        })
    } catch (error) {
        console.error('Renew recruiter subscription error:', error)
        res.status(500).json({ success: false, message: 'Failed to renew recruiter subscription' })
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
                payments: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found' })
        }

        const now = new Date()
        const expiry = candidate.subscriptionExpiryDate ? new Date(candidate.subscriptionExpiryDate) : null
        const daysRemaining = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

        res.json({
            success: true,
            candidate: {
                id: candidate.id,
                fullName: candidate.fullName,
                email: candidate.email,
                mobile: candidate.mobile,
                role: candidate.role,
                isVerified: candidate.isVerified,
                isPaid: candidate.isPaid,
                isActive: candidate.isActive,
                isProfileCompleted: candidate.isProfileCompleted,
                subscriptionStartDate: candidate.subscriptionStartDate ? candidate.subscriptionStartDate.toLocaleDateString() : null,
                subscriptionExpiryDate: candidate.subscriptionExpiryDate ? candidate.subscriptionExpiryDate.toLocaleDateString() : null,
                subscriptionDaysRemaining: daysRemaining,
                isExpired: daysRemaining !== null && daysRemaining <= 0,
                isExpiringSoon: daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30,
                profile: candidate.profile,
                applications: candidate.applications,
                paymentHistory: candidate.payments.map(p => ({
                    id: p.id,
                    orderId: p.orderId,
                    paymentId: p.paymentId,
                    amount: p.amount,
                    currency: p.currency,
                    status: p.status,
                    createdAt: p.createdAt.toLocaleDateString()
                })),
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
                payments: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!recruiter) {
            return res.status(404).json({ success: false, message: 'Recruiter not found' })
        }

        const now = new Date()
        const expiry = recruiter.subscriptionExpiryDate ? new Date(recruiter.subscriptionExpiryDate) : null
        const daysRemaining = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

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
                isPaid: recruiter.isPaid,
                isActive: recruiter.isActive,
                isProfileCompleted: recruiter.isProfileCompleted,
                subscriptionStartDate: recruiter.subscriptionStartDate ? recruiter.subscriptionStartDate.toLocaleDateString() : null,
                subscriptionExpiryDate: recruiter.subscriptionExpiryDate ? recruiter.subscriptionExpiryDate.toLocaleDateString() : null,
                subscriptionDaysRemaining: daysRemaining,
                isExpired: daysRemaining !== null && daysRemaining <= 0,
                isExpiringSoon: daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30,
                profile: recruiter.profile,
                jobs: recruiter.jobs,
                paymentHistory: recruiter.payments.map(p => ({
                    id: p.id,
                    orderId: p.orderId,
                    paymentId: p.paymentId,
                    amount: p.amount,
                    currency: p.currency,
                    status: p.status,
                    createdAt: p.createdAt.toLocaleDateString()
                })),
                createdAt: recruiter.createdAt.toLocaleDateString(),
                updatedAt: recruiter.updatedAt.toLocaleDateString()
            }
        })
    } catch (error) {
        console.error('Get recruiter profile error:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch recruiter profile' })
    }
}

export const getSubscriptionsExpiringToday = async (req: Request, res: Response) => {
    try {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // Candidates expiring today
        const candidates = await (prisma.candidate as any).findMany({
            where: {
                subscriptionExpiryDate: {
                    gte: today,
                    lt: tomorrow
                }
            },
            select: { id: true, fullName: true, email: true, mobile: true, subscriptionExpiryDate: true, isPaid: true }
        })

        // Recruiters expiring today
        const recruiters = await (prisma.recruiter as any).findMany({
            where: {
                subscriptionExpiryDate: {
                    gte: today,
                    lt: tomorrow
                }
            },
            select: { id: true, fullName: true, email: true, companyName: true, mobile: true, subscriptionExpiryDate: true, isPaid: true }
        })

        const mappedCandidates = (candidates as any[]).map((c: any) => ({
            id: c.id,
            name: c.fullName,
            email: c.email,
            mobile: c.mobile,
            type: 'Candidate' as const,
            expiryDate: new Date(c.subscriptionExpiryDate).toLocaleDateString(),
            isPaid: c.isPaid
        }))

        const mappedRecruiters = (recruiters as any[]).map((r: any) => ({
            id: r.id,
            name: r.fullName,
            email: r.email,
            companyName: r.companyName,
            mobile: r.mobile,
            type: 'Recruiter' as const,
            expiryDate: new Date(r.subscriptionExpiryDate).toLocaleDateString(),
            isPaid: r.isPaid
        }))

        res.json({
            success: true,
            data: {
                expiringToday: [...mappedCandidates, ...mappedRecruiters],
                count: mappedCandidates.length + mappedRecruiters.length,
                date: today.toLocaleDateString()
            }
        })
    } catch (error) {
        console.error('Get subscriptions expiring today error:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch subscriptions expiring today' })
    }
}

export const getAllSubscriptions = async (req: Request, res: Response) => {
    try {
        const now = new Date()
        const { type, status, search, page, limit } = req.query
        const pageNum = parseInt(page as string) || 1
        const limitNum = parseInt(limit as string) || 10
        const skip = (pageNum - 1) * limitNum

        let candidates: any[] = []
        let recruiters: any[] = []
        let candidateTotal = 0
        let recruiterTotal = 0

        // Fetch candidates if type is not specified or is 'candidate'
        if (!type || type === 'candidate') {
            const whereClause: any = {}
            
            if (status === 'active') {
                whereClause.isPaid = true
                whereClause.subscriptionExpiryDate = { gt: now }
            } else if (status === 'expired') {
                whereClause.isPaid = true
                whereClause.subscriptionExpiryDate = { lte: now }
            } else if (status === 'unpaid') {
                whereClause.isPaid = false
            }

            if (search) {
                whereClause.OR = [
                    { fullName: { contains: search as string, mode: 'insensitive' } },
                    { email: { contains: search as string, mode: 'insensitive' } }
                ]
            }

            const [results, total] = await Promise.all([
                prisma.candidate.findMany({
                    where: whereClause,
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        mobile: true,
                        isPaid: true,
                        isActive: true,
                        subscriptionStartDate: true,
                        subscriptionExpiryDate: true,
                        createdAt: true
                    },
                    orderBy: { subscriptionExpiryDate: { sort: 'asc', nulls: 'last' } },
                    skip: !type ? undefined : skip,
                    take: !type ? undefined : limitNum
                }),
                prisma.candidate.count({ where: whereClause })
            ])
            candidates = results
            candidateTotal = total
        }

        // Fetch recruiters if type is not specified or is 'recruiter'
        if (!type || type === 'recruiter') {
            const whereClause: any = {}
            
            if (status === 'active') {
                whereClause.isPaid = true
                whereClause.subscriptionExpiryDate = { gt: now }
            } else if (status === 'expired') {
                whereClause.isPaid = true
                whereClause.subscriptionExpiryDate = { lte: now }
            } else if (status === 'unpaid') {
                whereClause.isPaid = false
            }

            if (search) {
                whereClause.OR = [
                    { fullName: { contains: search as string, mode: 'insensitive' } },
                    { email: { contains: search as string, mode: 'insensitive' } },
                    { companyName: { contains: search as string, mode: 'insensitive' } }
                ]
            }

            const [results, total] = await Promise.all([
                prisma.recruiter.findMany({
                    where: whereClause,
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        companyName: true,
                        mobile: true,
                        isPaid: true,
                        isActive: true,
                        subscriptionStartDate: true,
                        subscriptionExpiryDate: true,
                        createdAt: true
                    },
                    orderBy: { subscriptionExpiryDate: { sort: 'asc', nulls: 'last' } },
                    skip: !type ? undefined : skip,
                    take: !type ? undefined : limitNum
                }),
                prisma.recruiter.count({ where: whereClause })
            ])
            recruiters = results
            recruiterTotal = total
        }

        const mappedCandidates = candidates.map((c: any) => {
            const expiry = c.subscriptionExpiryDate ? new Date(c.subscriptionExpiryDate) : null
            const daysRemaining = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
            
            return {
                id: c.id,
                name: c.fullName,
                email: c.email,
                mobile: c.mobile,
                type: 'Candidate' as const,
                isPaid: c.isPaid,
                isActive: c.isActive,
                subscriptionStartDate: c.subscriptionStartDate ? c.subscriptionStartDate.toLocaleDateString() : null,
                subscriptionExpiryDate: c.subscriptionExpiryDate ? c.subscriptionExpiryDate.toLocaleDateString() : null,
                daysRemaining,
                isExpired: daysRemaining !== null && daysRemaining <= 0,
                isExpiringSoon: daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30
            }
        })

        const mappedRecruiters = recruiters.map((r: any) => {
            const expiry = r.subscriptionExpiryDate ? new Date(r.subscriptionExpiryDate) : null
            const daysRemaining = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
            
            return {
                id: r.id,
                name: r.fullName,
                email: r.email,
                companyName: r.companyName,
                mobile: r.mobile,
                type: 'Recruiter' as const,
                isPaid: r.isPaid,
                isActive: r.isActive,
                subscriptionStartDate: r.subscriptionStartDate ? r.subscriptionStartDate.toLocaleDateString() : null,
                subscriptionExpiryDate: r.subscriptionExpiryDate ? r.subscriptionExpiryDate.toLocaleDateString() : null,
                daysRemaining,
                isExpired: daysRemaining !== null && daysRemaining <= 0,
                isExpiringSoon: daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30
            }
        })

        const allSubscriptions = [...mappedCandidates, ...mappedRecruiters]
        const total = type ? (type === 'candidate' ? candidateTotal : recruiterTotal) : candidateTotal + recruiterTotal

        res.json({
            success: true,
            data: allSubscriptions,
            total: allSubscriptions.length,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum * limitNum < total,
                hasPrevPage: pageNum > 1
            },
            filters: {
                type,
                status,
                search
            }
        })
    } catch (error) {
        console.error('Get all subscriptions error:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch subscriptions' })
    }
}
