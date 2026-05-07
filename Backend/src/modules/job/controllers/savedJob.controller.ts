import { Request, Response } from 'express'
import prisma from '../../../config/db'

// POST /api/saved-jobs/toggle/:jobId - Candidate saves or unsaves a job
export const toggleSaveJob = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id as string
        const jobId = req.params.jobId as string

        // Check if job exists
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        })

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        // Check if already saved
        const existing = await prisma.savedJob.findUnique({
            where: {
                jobId_candidateId: { jobId, candidateId }
            }
        })

        if (existing) {
            // Unsave
            await prisma.savedJob.delete({
                where: {
                    jobId_candidateId: { jobId, candidateId }
                }
            })
            return res.status(200).json({
                success: true,
                message: 'Job removed from saved list',
                isSaved: false
            })
        } else {
            // Save
            await prisma.savedJob.create({
                data: {
                    jobId,
                    candidateId
                }
            })
            return res.status(201).json({
                success: true,
                message: 'Job saved successfully',
                isSaved: true
            })
        }
    } catch (error) {
        console.error('[toggleSaveJob]', error)
        return res.status(500).json({ message: 'Server error while toggling save job' })
    }
}

// GET /api/saved-jobs - Candidate views their saved jobs with pagination
export const getMySavedJobs = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id as string
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit

        const [savedJobs, total] = await Promise.all([
            prisma.savedJob.findMany({
                where: { candidateId },
                include: {
                    job: {
                        include: {
                            recruiter: {
                                select: { companyName: true }
                            },
                            department: {
                                select: { name: true }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.savedJob.count({
                where: { candidateId }
            })
        ])

        return res.status(200).json({
            success: true,
            savedJobs: savedJobs.map((sj: any) => ({
                ...sj.job,
                savedAt: sj.createdAt
            })),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('[getMySavedJobs]', error)
        return res.status(500).json({ message: 'Server error while fetching saved jobs' })
    }
}

// GET /api/saved-jobs/check/:jobId - Check if a job is saved by the candidate
export const checkIfSaved = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id as string
        const jobId = req.params.jobId as string

        const existing = await prisma.savedJob.findUnique({
            where: {
                jobId_candidateId: { jobId, candidateId }
            }
        })

        return res.status(200).json({
            success: true,
            isSaved: !!existing
        })
    } catch (error) {
        console.error('[checkIfSaved]', error)
        return res.status(500).json({ message: 'Server error while checking saved status' })
    }
}
