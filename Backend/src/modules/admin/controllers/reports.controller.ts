import { Request, Response } from 'express'
import prisma from '../../../config/db'

// Helper to convert JSON array to CSV string
const jsonToCsv = (items: any[]) => {
    if (items.length === 0) return ''
    const replacer = (key: string, value: any) => value === null ? '' : value
    const header = Object.keys(items[0])
    const csv = [
        header.join(','), // header query
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')
    return csv
}

export const getReportsMetadata = async (req: Request, res: Response) => {
    try {
        const reports = [
            {
                id: 'company-candidates',
                title: 'Company-wise Candidates',
                description: 'Export number of candidates applied per company with job title breakdown.',
                icon: 'BarChart3',
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-600',
                category: 'Candidate',
                rows: `${await prisma.application.count()} records`,
            },
            {
                id: 'applications',
                title: 'Job Application Report',
                description: 'Detailed report of all job applications with status and timestamps.',
                icon: 'FileText',
                iconBg: 'bg-purple-50',
                iconColor: 'text-purple-600',
                category: 'Applications',
                rows: `${await prisma.application.count()} records`,
            },
            {
                id: 'recruiters',
                title: 'Recruiter List',
                description: 'All registered recruiters with company details, approval status and job count.',
                icon: 'FileSpreadsheet',
                iconBg: 'bg-orange-50',
                iconColor: 'text-orange-500',
                category: 'Recruiter',
                rows: `${await prisma.recruiter.count()} records`,
            },
            {
                id: 'jobs-moderation',
                title: 'Job Moderation Log',
                description: 'All flagged, removed, or restored jobs with admin action history.',
                icon: 'FileText',
                iconBg: 'bg-red-50',
                iconColor: 'text-red-500',
                category: 'Moderation',
                rows: `${await prisma.job.count({ where: { OR: [{ isFlagged: true }, { isRemoved: true }] } })} jobs`,
            }
        ]
        res.json({ success: true, reports })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch reports metadata' })
    }
}

export const downloadReport = async (req: Request, res: Response) => {
    try {
        const { reportId } = req.params
        const { format } = req.query

        let data: any[] = []
        let fileName = `report-${reportId}-${Date.now()}`

        switch (reportId) {
            case 'company-candidates':
                const applications = await prisma.application.findMany({
                    include: {
                        job: { include: { recruiter: true } },
                        candidate: true
                    }
                })
                data = applications.map(a => ({
                    Candidate: a.candidate.fullName,
                    Email: a.candidate.email,
                    Company: a.job.recruiter.companyName,
                    JobTitle: a.job.title,
                    Status: a.status,
                    AppliedAt: a.createdAt
                }))
                break

            case 'applications':
                const allApps = await prisma.application.findMany({
                    include: { job: true, candidate: true }
                })
                data = allApps.map(a => ({
                    ID: a.id,
                    Job: a.job.title,
                    Candidate: a.candidate.fullName,
                    Status: a.status,
                    Date: a.createdAt
                }))
                break

            case 'recruiters':
                const recruiters = await prisma.recruiter.findMany({
                    include: { _count: { select: { jobs: true } } }
                })
                data = recruiters.map(r => ({
                    Company: r.companyName,
                    Contact: r.fullName,
                    Email: r.email,
                    Status: r.verificationStatus,
                    JobsPosted: r._count.jobs,
                    JoinedOn: r.createdAt
                }))
                break

            case 'jobs-moderation':
                const jobs = await prisma.job.findMany({
                    where: { OR: [{ isFlagged: true }, { isRemoved: true }] },
                    include: { recruiter: true }
                })
                data = jobs.map(j => ({
                    Title: j.title,
                    Company: j.recruiter.companyName,
                    Flagged: j.isFlagged,
                    Removed: j.isRemoved,
                    Status: j.status,
                    CreatedAt: j.createdAt
                }))
                break

            default:
                return res.status(404).json({ success: false, message: 'Report type not found' })
        }

        const csv = jsonToCsv(data)
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.csv`)
        res.status(200).send(csv)

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate report' })
    }
}
