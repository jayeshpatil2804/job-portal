import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getAllDesignations = async (req: Request, res: Response) => {
    try {
        const designations = await prisma.designation.findMany({
            orderBy: { name: 'asc' }
        })
        res.json({ success: true, designations })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch designations' })
    }
}

export const createDesignation = async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        if (!name) return res.status(400).json({ message: 'Name is required' })

        const designation = await prisma.designation.create({
            data: { name }
        })
        res.status(201).json({ success: true, designation })
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return res.status(400).json({ message: 'Designation already exists' })
        }
        res.status(500).json({ success: false, message: 'Failed to create designation' })
    }
}

export const updateDesignation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const { name } = req.body
        if (!name) return res.status(400).json({ message: 'Name is required' })

        const designation = await prisma.designation.update({
            where: { id },
            data: { name }
        })
        res.json({ success: true, designation })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update designation' })
    }
}

export const deleteDesignation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await prisma.designation.delete({ where: { id } })
        res.json({ success: true, message: 'Designation deleted' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete designation' })
    }
}
