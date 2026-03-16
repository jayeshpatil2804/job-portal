import { Request, Response, NextFunction } from 'express'

export const validateJob = (req: Request, res: Response, next: NextFunction) => {
    const { title, department, experience, location, vacancies, description } = req.body

    const errors: string[] = []

    if (!title || title.trim() === '') errors.push('Job title is required')
    if (!department || department.trim() === '') errors.push('Department is required')
    if (!experience || experience.trim() === '') errors.push('Experience level is required')
    if (!location || location.trim() === '') errors.push('Location is required')
    if (!description || description.trim() === '') errors.push('Job description is required')

    if (vacancies !== undefined && (isNaN(Number(vacancies)) || Number(vacancies) < 1)) {
        errors.push('Vacancies must be a positive number')
    }

    const salaryMin = req.body.salaryMin
    const salaryMax = req.body.salaryMax
    if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
        errors.push('Minimum salary cannot be greater than maximum salary')
    }

    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors })
    }

    next()
}
