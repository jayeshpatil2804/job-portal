import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await prisma.job.findMany({
            include: { recruiter: { include: { profile: true } }, _count: { select: { applications: true } } },
            orderBy: { createdAt: 'desc' },
        })

        const formattedJobs = jobs.map(j => ({
            id: j.id,
            title: j.title,
            company: j.recruiter.companyName,
            location: j.location,
            type: j.jobType === 'FULL_TIME' ? 'Full-time' : j.jobType === 'PART_TIME' ? 'Part-time' : j.jobType === 'CONTRACT' ? 'Contract' : j.jobType === 'INTERNSHIP' ? 'Internship' : 'Other',
            salary: j.salaryMin && j.salaryMax ? `₹${j.salaryMin/100000}L - ₹${j.salaryMax/100000}L` : 'Not specified',
            posted: j.createdAt.toLocaleDateString(),
            applications: j._count.applications,
            status: j.isRemoved ? 'REMOVED' : j.status,
            flagged: j.isFlagged
        }))

        res.json({ success: true, jobs: formattedJobs })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch jobs' })
    }
}

export const toggleJobFlag = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const job = await prisma.job.findUnique({ where: { id } })
        
        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' })
            return
        }

        await prisma.job.update({
            where: { id },
            data: { isFlagged: !job.isFlagged }
        })

        res.json({ success: true, message: `Job ${job.isFlagged ? 'unflagged' : 'flagged'} successfully` })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to flag job' })
    }
}

export const toggleJobRemove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const { removed } = req.body // boolean

        await prisma.job.update({
            where: { id },
            data: { isRemoved: removed }
        })

        res.json({ success: true, message: `Job ${removed ? 'removed' : 'restored'} successfully` })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update job status' })
    }
}
