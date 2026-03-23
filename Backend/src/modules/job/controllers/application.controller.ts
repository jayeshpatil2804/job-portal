import { Request, Response } from 'express'
import prisma from '../../../config/db'

// POST /api/applications/apply/:jobId - Candidate applies to a job
export const applyToJob = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id as string
        const jobId = req.params.jobId as string

        // Check if job exists and is OPEN
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        })

        if (!job || job.status !== 'OPEN') {
            return res.status(404).json({ message: 'Job not found or not open for applications' })
        }

        // Check if candidate has paid
        const shooter = await prisma.candidate.findUnique({
            where: { id: candidateId },
            select: { isPaid: true }
        })

        if (!shooter?.isPaid) {
            return res.status(403).json({ 
                success: false, 
                message: 'Payment required to apply for jobs. Please complete your payment.' 
            })
        }

        // Check for existing application
        const existing = await (prisma as any).application.findUnique({
            where: {
                jobId_candidateId: { jobId, candidateId }
            }
        })

        if (existing) {
            return res.status(400).json({ message: 'You have already applied for this job' })
        }

        // Get candidate's current resume from profile
        const profile = await prisma.candidateProfile.findUnique({
            where: { candidateId }
        })

        if (!profile || !profile.resumeFileId) {
            return res.status(400).json({ message: 'Please upload a resume in your profile before applying' })
        }

        const application = await (prisma as any).application.create({
            data: {
                jobId,
                candidateId,
                resumeFileId: profile.resumeFileId,
                status: 'APPLIED'
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        })
    } catch (error) {
        console.error('[applyToJob]', error)
        return res.status(500).json({ message: 'Server error while applying for job' })
    }
}

// GET /api/applications/candidate/my - Candidate views their applications
export const getMyApplications = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id as string

        const applications = await (prisma as any).application.findMany({
            where: { candidateId },
            include: {
                job: {
                    select: {
                        title: true,
                        location: true,
                        jobType: true,
                        recruiter: {
                            select: { companyName: true }
                        }
                    }
                },
                interview: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return res.status(200).json({
            success: true,
            applications
        })
    } catch (error) {
        console.error('[getMyApplications]', error)
        return res.status(500).json({ message: 'Server error while fetching applications' })
    }
}

// GET /api/applications/job/:jobId - Recruiter views applicants for a job
export const getJobApplicants = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id as string
        const jobId = req.params.jobId as string

        // Verify ownership
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        })

        if (!job || job.recruiterId !== recruiterId) {
            return res.status(403).json({ message: 'Unauthorized' })
        }

        console.log(`[getJobApplicants] Fetching for jobId: ${jobId} by recruiterId: ${recruiterId}`)

        const applicants = await (prisma as any).application.findMany({
            where: { jobId },
            include: {
                candidate: {
                    select: {
                        fullName: true,
                        email: true,
                        mobile: true,
                        profile: {
                            select: {
                                yearsOfExp: true,
                                skills: true,
                                city: true,
                                state: true,
                                isExperienced: true,
                                resumeUrl: true,
                                resumeFile: {
                                    select: { fileUrl: true }
                                }
                            }
                        }
                    }
                },
                resumeFile: {
                    select: { fileUrl: true }
                },
                interview: true
            },
            orderBy: { createdAt: 'desc' }
        })

        console.log(`[getJobApplicants] Found ${applicants.length} applicants`)

        return res.status(200).json({
            success: true,
            applicants
        })
    } catch (error) {
        console.error('[getJobApplicants]', error)
        return res.status(500).json({ message: 'Server error while fetching applicants' })
    }
}

// PATCH /api/applications/:id/status - Recruiter updates application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id as string
        const id = req.params.id as string
        const { status } = req.body

        const validStatuses = ['VIEWED', 'SHORTLISTED', 'REJECTED']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status update' })
        }

        const application = await (prisma as any).application.findUnique({
            where: { id },
            include: { job: true }
        })

        if (!application || application.job.recruiterId !== recruiterId) {
            return res.status(403).json({ message: 'Unauthorized' })
        }

        const updated = await (prisma as any).application.update({
            where: { id },
            data: { status }
        })

        return res.status(200).json({
            success: true,
            message: `Application status updated to ${status}`,
            application: updated
        })
    } catch (error) {
        console.error('[updateApplicationStatus]', error)
        return res.status(500).json({ message: 'Server error while updating application status' })
    }
}
