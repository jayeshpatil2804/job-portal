import { Request, Response } from 'express';
import prisma from '../../../config/db';

export const getCandidateStats = async (req: any, res: Response) => {
    try {
        const candidateId = req.user.id;

        // 1. Total Applications
        const totalApplications = await (prisma as any).application.count({
            where: { candidateId }
        });

        // 2. Status Breakdown for Chart
        const statusCounts = await (prisma as any).application.groupBy({
            by: ['status'],
            where: { candidateId },
            _count: {
                status: true
            }
        });

        // 3. Specific counts for top boxes
        const interviewCount = await (prisma as any).application.count({
            where: { candidateId, status: 'INTERVIEW_SCHEDULED' }
        });

        const shortlistedCount = await (prisma as any).application.count({
            where: { candidateId, status: 'SHORTLISTED' }
        });

        // 4. Recent Applications
        const recentApplications = await (prisma as any).application.findMany({
            where: { candidateId },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                job: {
                    select: {
                        title: true,
                        recruiter: {
                            select: {
                                companyName: true
                            }
                        },
                        location: true
                    }
                }
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalApplications,
                    interviewCount,
                    shortlistedCount,
                    statusBreakdown: statusCounts.map((s: any) => ({
                        status: s.status,
                        count: s._count.status
                    }))
                },
                recentApplications: recentApplications.map((app: any) => ({
                    id: app.id,
                    jobTitle: app.job.title,
                    company: app.job.recruiter.companyName,
                    appliedDate: app.createdAt.toISOString().split('T')[0],
                    status: app.status
                }))
            }
        });
    } catch (error: any) {
        console.error('Error fetching candidate stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

export const getRecruiterStats = async (req: any, res: Response) => {
    try {
        const recruiterId = req.user.id;

        // 1. Total Jobs
        const totalJobs = await (prisma as any).job.count({
            where: { recruiterId }
        });

        // 2. Total Applicants
        const totalApplicants = await (prisma as any).application.count({
            where: {
                job: {
                    recruiterId
                }
            }
        });

        // 3. Status Breakdown of all applications received
        const statusCounts = await (prisma as any).application.groupBy({
            by: ['status'],
            where: {
                job: {
                    recruiterId
                }
            },
            _count: {
                status: true
            }
        });

        // 4. Recent Jobs
        const recentJobs = await (prisma as any).job.findMany({
            where: { recruiterId },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalJobs,
                    totalApplicants,
                    statusBreakdown: statusCounts.map((s: any) => ({
                        status: s.status,
                        count: s._count.status
                    }))
                },
                recentJobs: recentJobs.map((job: any) => ({
                    id: job.id,
                    title: job.title,
                    applicants: job._count.applications,
                    status: job.status,
                    date: job.createdAt.toISOString().split('T')[0]
                }))
            }
        });
    } catch (error: any) {
        console.error('Error fetching recruiter stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};
