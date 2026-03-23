import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [
            totalCandidates,
            totalRecruiters,
            activeJobs,
            totalApplications,
            pendingRecruiters
        ] = await Promise.all([
            prisma.candidate.count(),
            prisma.recruiter.count(),
            prisma.job.count({ where: { status: 'OPEN' } }),
            prisma.application.count(),
            prisma.recruiter.count({ where: { verificationStatus: 'PENDING' } })
        ])

        // Mock revenue for now as there's no payment model yet
        const revenue = '₹0' 

        // Application Breakdown
        const [
            applied,
            shortlisted,
            interviewed,
            hired,
            rejected
        ] = await Promise.all([
            prisma.application.count({ where: { status: 'APPLIED' } }),
            prisma.application.count({ where: { status: 'SHORTLISTED' } }),
            prisma.application.count({ where: { status: 'INTERVIEW_SCHEDULED' } }),
            prisma.application.count({ where: { status: 'HIRED' } }),
            prisma.application.count({ where: { status: 'REJECTED' } })
        ])

        const applicationBreakdown = [
            { name: 'Applied', value: applied, color: '#3b82f6' },
            { name: 'Shortlisted', value: shortlisted, color: '#a855f7' },
            { name: 'Interviews', value: interviewed, color: '#f97316' },
            { name: 'Hired', value: hired, color: '#22c55e' },
            { name: 'Rejected', value: rejected, color: '#ef4444' },
        ]

        // Get growth data (last 6 months) - simplified for now
        const monthlyData = [
            { month: 'Oct', candidates: 0, jobs: 0 },
            { month: 'Nov', candidates: 0, jobs: 0 },
            { month: 'Dec', candidates: 0, jobs: 0 },
            { month: 'Jan', candidates: 0, jobs: 0 },
            { month: 'Feb', candidates: 0, jobs: 0 },
            { month: 'Mar', candidates: totalCandidates, jobs: activeJobs },
        ]

        res.json({
            success: true,
            stats: {
                totalCandidates,
                totalRecruiters,
                activeJobs,
                totalApplications,
                revenue,
                pendingRecruiters,
                applicationBreakdown
            },
            monthlyData
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' })
    }
}

export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        // Fetch recent recruiters and jobs with minimal fields for smaller response payload
        const [recentRecruiters, recentJobs] = await Promise.all([
            prisma.recruiter.findMany({ 
                take: 5, 
                orderBy: { createdAt: 'desc' },
                select: { id: true, companyName: true, createdAt: true, verificationStatus: true }
            }),
            prisma.job.findMany({ 
                take: 5, 
                orderBy: { createdAt: 'desc' },
                select: { id: true, title: true, createdAt: true, recruiter: { select: { companyName: true } } }
            })
        ])

        const activity = [
            ...recentRecruiters.map(r => ({
                id: `r-${r.id}`,
                type: 'Recruiter Registered',
                detail: `${r.companyName} applying for verification`,
                time: new Date(r.createdAt).toLocaleDateString(),
                dot: r.verificationStatus === 'APPROVED' ? 'bg-green-500' : 'bg-blue-500'
            })),
            ...recentJobs.map(j => ({
                id: `j-${j.id}`,
                type: 'New Job Posted',
                detail: `${j.title} by ${j.recruiter.companyName}`,
                time: new Date(j.createdAt).toLocaleDateString(),
                dot: 'bg-orange-500'
            }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

        res.json({ success: true, activity })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch activity' })
    }
}
