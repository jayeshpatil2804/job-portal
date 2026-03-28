import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getAllSkills = async (req: Request, res: Response) => {
    try {
        const { category } = req.query
        const skills = await prisma.skill.findMany({
            where: category ? { category: category as string } : {},
            orderBy: { name: 'asc' }
        })
        res.json({ success: true, skills })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch skills' })
    }
}

export const createSkill = async (req: Request, res: Response) => {
    try {
        const { name, category } = req.body
        if (!name) return res.status(400).json({ message: 'Name is required' })

        const skill = await prisma.skill.create({
            data: { name, category }
        })
        res.status(201).json({ success: true, skill })
    } catch (error) {
        if ((error as any).code === 'P2002') {
            return res.status(400).json({ message: 'Skill already exists' })
        }
        res.status(500).json({ success: false, message: 'Failed to create skill' })
    }
}

export const updateSkill = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const { name, category } = req.body
        if (!name) return res.status(400).json({ message: 'Name is required' })

        const skill = await prisma.skill.update({
            where: { id },
            data: { name, category }
        })
        res.json({ success: true, skill })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update skill' })
    }
}

export const deleteSkill = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await prisma.skill.delete({ where: { id } })
        res.json({ success: true, message: 'Skill deleted' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete skill' })
    }
}
