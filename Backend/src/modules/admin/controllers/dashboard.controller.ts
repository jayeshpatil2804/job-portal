import { Request, Response } from 'express'
import prisma from '../../../config/db'

let statsCache: { data: any, timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 60 seconds

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Check cache
        if (statsCache && (Date.now() - statsCache.timestamp) < CACHE_DURATION) {
            return res.json({
                success: true,
                stats: statsCache.data.stats,
                monthlyData: statsCache.data.monthlyData,
                cached: true
            });
        }

        const [
            totalCandidates,
            appGroupCounts,
            recGroupCounts,
            activeJobs,
            totalApplications
        ] = await Promise.all([
            prisma.candidate.count(),
            prisma.application.groupBy({
                by: ['status'],
                _count: { _all: true }
            }),
            prisma.recruiter.groupBy({
                by: ['verificationStatus'],
                _count: { _all: true }
            }),
            prisma.job.count({ where: { status: 'OPEN' } }),
            prisma.application.count()
        ])

        // Extract pending recruiters
        const pendingRecruiters = recGroupCounts.find(r => r.verificationStatus === 'PENDING')?._count._all || 0;
        const totalRecruiters = recGroupCounts.reduce((acc, r) => acc + r._count._all, 0);

        // Map application breakdown
        const getCount = (status: string) => appGroupCounts.find(a => a.status === status)?._count._all || 0;
        
        const applicationBreakdown = [
            { name: 'Applied', value: getCount('APPLIED'), color: '#3b82f6' },
            { name: 'Shortlisted', value: getCount('SHORTLISTED'), color: '#a855f7' },
            { name: 'Interviews', value: getCount('INTERVIEW_SCHEDULED'), color: '#f97316' },
            { name: 'Hired', value: getCount('HIRED'), color: '#22c55e' },
            { name: 'Rejected', value: getCount('REJECTED'), color: '#ef4444' },
        ]

        const revenue = '₹0' 

        const monthlyData = [
            { month: 'Oct', candidates: 0, jobs: 0 },
            { month: 'Nov', candidates: 0, jobs: 0 },
            { month: 'Dec', candidates: 0, jobs: 0 },
            { month: 'Jan', candidates: 0, jobs: 0 },
            { month: 'Feb', candidates: 0, jobs: 0 },
            { month: 'Mar', candidates: totalCandidates, jobs: activeJobs },
        ]

        const responseData = {
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
        };

        // Update cache
        statsCache = {
            data: responseData,
            timestamp: Date.now()
        };

        res.json({
            success: true,
            ...responseData
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
