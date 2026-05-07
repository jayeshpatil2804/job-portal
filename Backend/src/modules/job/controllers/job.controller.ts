import { Request, Response } from 'express'
import prisma from '../../../config/db'

// POST /api/jobs - Create a new job
export const createJob = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id
        const { 
            title, departmentId, jobType, experience, 
            salaryMin, salaryMax, location, vacancies, 
            description, responsibilities, requirements, 
            skills, benefits, deadline, isFeatured, isRemote,
            status, skillIds
        } = req.body



        const job = await prisma.job.create({
            data: {
                recruiterId,
                title,
                jobType,
                experience,
                salaryMin: salaryMin ? parseInt(salaryMin) : null,
                salaryMax: salaryMax ? parseInt(salaryMax) : null,
                location,
                vacancies: vacancies ? parseInt(vacancies) : 1,
                description,
                responsibilities,
                requirements,
                skills,
                benefits,
                deadline: deadline ? new Date(deadline) : null,
                isFeatured: isFeatured === true || isFeatured === 'true',
                isRemote: isRemote === true || isRemote === 'true',
                status: status || 'OPEN',
                departmentId: departmentId || null,
                skillsReq: skillIds ? {
                    connect: (Array.isArray(skillIds) ? skillIds : [skillIds]).map((id: string) => ({ id }))
                } : undefined
            }
        })

        return res.status(201).json({
            success: true,
            message: 'Job published successfully',
            job
        })
    } catch (error) {
        console.error('[createJob]', error)
        return res.status(500).json({ message: 'Server error while creating job' })
    }
}

// GET /api/jobs/my - Get all jobs posted by the logged-in recruiter
export const getMyJobs = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id

        const jobs = await prisma.job.findMany({
            where: { recruiterId },
            include: {
                _count: {
                    select: { applications: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return res.status(200).json({
            success: true,
            jobs
        })
    } catch (error) {
        console.error('[getMyJobs]', error)
        return res.status(500).json({ message: 'Server error while fetching jobs' })
    }
}

// GET /api/jobs/:id - Get a single job by ID
export const getJobById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string

        const job = await prisma.job.findUnique({
            where: { id },
            include: { 
                recruiter: { select: { fullName: true, companyName: true, email: true } },
                department: true,
                skillsReq: true,
                _count: {
                    select: { applications: true }
                }
            }
        })

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        return res.status(200).json({ success: true, job })
    } catch (error) {
        console.error('[getJobById]', error)
        return res.status(500).json({ message: 'Server error while fetching job' })
    }
}

// PUT /api/jobs/:id - Edit an existing job
export const editJob = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id
        const id = req.params.id as string
        const { 
            title, departmentId, jobType, experience, 
            salaryMin, salaryMax, location, vacancies, 
            description, responsibilities, requirements, 
            skills, benefits, deadline, isFeatured, isRemote,
            skillIds
        } = req.body

        // Ensure the job belongs to this recruiter
        const existing = await prisma.job.findUnique({ where: { id } })
        if (!existing) return res.status(404).json({ message: 'Job not found' })
        if (existing.recruiterId !== recruiterId) {
            return res.status(403).json({ message: 'You are not allowed to edit this job' })
        }
        if (existing.status === 'CLOSED') {
            return res.status(400).json({ message: 'Cannot edit a closed job' })
        }

        const job = await prisma.job.update({
            where: { id },
            data: {
                title,
                jobType,
                experience,
                salaryMin: salaryMin ? parseInt(salaryMin) : null,
                salaryMax: salaryMax ? parseInt(salaryMax) : null,
                location,
                vacancies: vacancies ? parseInt(vacancies) : undefined,
                description,
                responsibilities,
                requirements,
                skills,
                benefits,
                deadline: deadline ? new Date(deadline) : null,
                isFeatured: isFeatured === true || isFeatured === 'true',
                isRemote: isRemote === true || isRemote === 'true',
                departmentId: departmentId || undefined,
                skillsReq: skillIds ? {
                    set: (Array.isArray(skillIds) ? skillIds : [skillIds]).map((id: string) => ({ id }))
                } : undefined
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            job
        })
    } catch (error) {
        console.error('[editJob]', error)
        return res.status(500).json({ message: 'Server error while updating job' })
    }
}

// PATCH /api/jobs/:id/close - Close a job (stop accepting applications)
export const closeJob = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id
        const id = req.params.id as string

        const existing = await prisma.job.findUnique({ where: { id } })
        if (!existing) return res.status(404).json({ message: 'Job not found' })
        if (existing.recruiterId !== recruiterId) {
            return res.status(403).json({ message: 'You are not allowed to close this job' })
        }

        const job = await prisma.job.update({
            where: { id },
            data: { status: 'CLOSED' }
        })

        return res.status(200).json({
            success: true,
            message: 'Job closed successfully',
            job
        })
    } catch (error) {
        console.error('[closeJob]', error)
        return res.status(500).json({ message: 'Server error while closing job' })
    }
}

// PATCH /api/jobs/:id/status - Update job status
export const updateJobStatus = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id
        const id = req.params.id as string
        const { status } = req.body

        if (!['OPEN', 'CLOSED', 'DRAFT'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' })
        }

        const existing = await prisma.job.findUnique({ where: { id } })
        if (!existing) return res.status(404).json({ message: 'Job not found' })
        if (existing.recruiterId !== recruiterId) {
            return res.status(403).json({ message: 'You are not allowed to update this job' })
        }

        const job = await prisma.job.update({
            where: { id },
            data: { status }
        })

        return res.status(200).json({
            success: true,
            message: `Job status updated to ${status}`,
            job
        })
    } catch (error) {
        console.error('[updateJobStatus]', error)
        return res.status(500).json({ message: 'Server error while updating job status' })
    }
}

// DELETE /api/jobs/:id - Delete a job permanently
export const deleteJob = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id
        const id = req.params.id as string

        const existing = await prisma.job.findUnique({ where: { id } })
        if (!existing) return res.status(404).json({ message: 'Job not found' })
        if (existing.recruiterId !== recruiterId) {
            return res.status(403).json({ message: 'You are not allowed to delete this job' })
        }

        await prisma.job.delete({ where: { id } })

        return res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        })
    } catch (error) {
        console.error('[deleteJob]', error)
        return res.status(500).json({ message: 'Server error while deleting job' })
    }
}

// GET /api/jobs - Get all OPEN jobs (for candidates / public listing)
export const getAllOpenJobs = async (req: Request, res: Response) => {
    try {
        const { search, location, departmentId, experience, jobType, minSalary, maxSalary, page, limit } = req.query
        
        const currentPage = parseInt(page as string) || 1
        const itemsPerPage = parseInt(limit as string) || 10
        const skip = (currentPage - 1) * itemsPerPage

        const where: any = {
            status: 'OPEN',
            isRemoved: false,
            isFlagged: false,
        }

        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
                { recruiter: { companyName: { contains: search as string, mode: 'insensitive' } } }
            ]
        }

        if (location) {
            where.location = { contains: location as string, mode: 'insensitive' }
        }

        if (departmentId) {
            where.departmentId = departmentId as string
        }

        if (experience) {
            where.experience = experience as string
        }

        if (jobType) {
            where.jobType = jobType as any
        }

        if (minSalary || maxSalary) {
            where.salaryMax = {
                ...(minSalary ? { gte: parseInt(minSalary as string) } : {}),
                ...(maxSalary ? { lte: parseInt(maxSalary as string) } : {})
            }
        }

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                include: {
                    recruiter: { select: { fullName: true, companyName: true } },
                    department: true,
                    skillsReq: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: itemsPerPage
            }),
            prisma.job.count({ where })
        ])

        return res.status(200).json({ 
            success: true, 
            jobs,
            pagination: {
                total,
                page: currentPage,
                limit: itemsPerPage,
                totalPages: Math.ceil(total / itemsPerPage),
                hasNextPage: currentPage * itemsPerPage < total
            }
        })
    } catch (error) {
        console.error('[getAllOpenJobs]', error)
        return res.status(500).json({ message: 'Server error while fetching jobs' })
    }
}
