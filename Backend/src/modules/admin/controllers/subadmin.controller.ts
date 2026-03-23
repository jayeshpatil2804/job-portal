import { Request, Response } from 'express'
import prisma from '../../../config/db'
import bcrypt from 'bcryptjs'

export const getSubAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await prisma.admin.findMany({
            orderBy: { createdAt: 'asc' }
        })

        const formatted = admins.map(a => ({
            id: a.id,
            name: a.fullName,
            email: a.email,
            role: a.isSuperAdmin ? 'SUPER_ADMIN' : 'SUB_ADMIN',
            createdOn: a.createdAt.toLocaleDateString(),
            permissions: a.permissions
        }))

        res.json({ success: true, admins: formatted })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch sub-admins' })
    }
}

export const createSubAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, permissions } = req.body

        const exists = await prisma.admin.findUnique({ where: { email } })
        if (exists) {
            res.status(400).json({ success: false, message: 'Email already in use' })
             return;
        }

        const hashedPassword = await bcrypt.hash('Admin@123', 10) // Default password

        await prisma.admin.create({
            data: {
                fullName: name,
                email,
                password: hashedPassword,
                permissions,
                isSuperAdmin: false
            }
        })

        res.status(201).json({ success: true, message: 'Sub-admin created successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create sub-admin' })
    }
}

export const updateSubAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const { name, email, permissions } = req.body

        await prisma.admin.update({
            where: { id },
            data: { fullName: name, email, permissions }
        })

        res.json({ success: true, message: 'Sub-admin updated successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update sub-admin' })
    }
}

export const deleteSubAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        
        const admin = await prisma.admin.findUnique({ where: { id } })
        if (!admin || admin.isSuperAdmin) {
            res.status(403).json({ success: false, message: 'Cannot delete super admin' })
            return
        }

        await prisma.admin.delete({ where: { id } })

        res.json({ success: true, message: 'Sub-admin deleted effectively' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete sub-admin' })
    }
}
