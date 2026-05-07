import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getAllDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await prisma.department.findMany({
            orderBy: { name: 'asc' }
        })
        res.json({ success: true, departments })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch departments' })
    }
}

export const createDepartment = async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        if (!name) return res.status(400).json({ message: 'Name is required' })

        const department = await prisma.department.create({
            data: { name }
        })
        res.status(201).json({ success: true, department })
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return res.status(400).json({ message: 'Department already exists' })
        }
        res.status(500).json({ success: false, message: 'Failed to create department' })
    }
}

export const updateDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const { name } = req.body
        if (!name) return res.status(400).json({ message: 'Name is required' })

        const department = await prisma.department.update({
            where: { id },
            data: { name }
        })
        res.json({ success: true, department })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update department' })
    }
}

export const deleteDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await prisma.department.delete({ where: { id } })
        res.json({ success: true, message: 'Department deleted' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete department' })
    }
}
