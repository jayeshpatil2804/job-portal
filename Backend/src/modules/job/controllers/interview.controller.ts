import { Request, Response } from 'express'
import prisma from '../../../config/db'
import { sendInterviewEmail } from '../../../utils/mailer'

// POST /api/interviews/schedule - Recruiter schedules an interview
export const scheduleInterview = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id as string
        const { applicationId, date, time, mode, location, notes, duration } = req.body

        // Verify application and ownership
        const application = await (prisma as any).application.findUnique({
            where: { id: applicationId as string },
            include: { job: true }
        })

        if (!application || application.job.recruiterId !== recruiterId) {
            return res.status(403).json({ message: 'Unauthorized' })
        }

        // Combine date and time into a date object
        const interviewDate = new Date(date)

        // Create interview and update application status atomically
        const [interview] = await (prisma as any).$transaction([
            (prisma as any).interview.create({
                data: {
                    applicationId,
                    date: interviewDate,
                    mode: mode || 'ONLINE',
                    location,
                    notes,
                    duration: duration ? parseInt(duration) : 60
                }
            }),
            (prisma as any).application.update({
                where: { id: applicationId as string },
                data: { status: 'INTERVIEW_SCHEDULED' }
            })
        ])

        // Send Email Notification
        const appWithDetails = await (prisma as any).application.findUnique({
            where: { id: applicationId as string },
            include: {
                candidate: true,
                job: {
                    include: {
                        recruiter: true
                    }
                }
            }
        })

        if (appWithDetails) {
            await sendInterviewEmail(appWithDetails.candidate.email, {
                jobTitle: appWithDetails.job.title,
                company: appWithDetails.job.recruiter.companyName,
                date: interviewDate.toLocaleDateString(),
                time: interviewDate.toLocaleTimeString(),
                mode: mode || 'ONLINE',
                location: location,
                notes: notes
            })
        }

        return res.status(201).json({
            success: true,
            message: 'Interview scheduled successfully and candidate notified',
            interview
        })
    } catch (error) {
        console.error('[scheduleInterview]', error)
        return res.status(500).json({ message: 'Server error while scheduling interview' })
    }
}

// GET /api/interviews/my - Get interviews for logged in user (Candidate or Recruiter)
export const getMyInterviews = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id as string
        const role = (req as any).user.role

        let interviews
        if (role === 'RECRUITER') {
            interviews = await (prisma as any).interview.findMany({
                where: {
                    application: {
                        job: { recruiterId: userId }
                    }
                },
                include: {
                    application: {
                        include: {
                            candidate: {
                                select: { fullName: true, email: true }
                            },
                            job: {
                                select: { title: true }
                            }
                        }
                    }
                },
                orderBy: { date: 'asc' }
            })
        } else {
            interviews = await (prisma as any).interview.findMany({
                where: {
                    application: { candidateId: userId }
                },
                include: {
                    application: {
                        include: {
                            job: {
                                select: { 
                                    title: true,
                                    recruiter: { select: { companyName: true } }
                                }
                            }
                        }
                    }
                },
                orderBy: { date: 'asc' }
            })
        }

        return res.status(200).json({
            success: true,
            interviews
        })
    } catch (error) {
        console.error('[getMyInterviews]', error)
        return res.status(500).json({ message: 'Server error while fetching interviews' })
    }
}
