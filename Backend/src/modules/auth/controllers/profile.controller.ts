import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getProfileStatus = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id

        // Using (prisma as any) to bypass IDE type lag after schema update
        const profile = await (prisma as any).candidateProfile.findUnique({
            where: { candidateId },
            include: {
                candidate: {
                    select: {
                        isProfileCompleted: true,
                        isPaid: true,
                        isActive: true
                    }
                }
            }
        })

        if (!profile) {
            return res.json({
                currentStep: 1,
                isProfileCompleted: false,
                data: {}
            })
        }

        return res.json({
            currentStep: profile.onboardingStep,
            isProfileCompleted: profile.candidate.isProfileCompleted,
            isPaid: profile.candidate.isPaid,
            isActive: (profile.candidate as any).isActive,
            data: profile
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const completeCandidateProfile = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id
        const { 
            onboardingStep, 
            isProfileCompleted, 
            id, 
            candidateId: _, 
            candidate, 
            createdAt, 
            updatedAt, 
            resumeFile,
            ...data 
        } = req.body

        // Ensure skills is treated as a comma-separated string
        if (data.skills) {
            if (Array.isArray(data.skills)) {
                data.skills = data.skills.join(',')
            } else if (typeof data.skills !== 'string') {
                data.skills = String(data.skills)
            }
        }

        const profile = await (prisma as any).candidateProfile.upsert({
            where: { candidateId },
            update: {
                ...data,
                onboardingStep: onboardingStep || undefined
            },
            create: {
                candidateId,
                ...data,
                onboardingStep: onboardingStep || 1
            }
        })

        // If this was the last step, mark profile as completed on the Candidate model
        if (isProfileCompleted) {
            await (prisma as any).candidate.update({
                where: { id: candidateId },
                data: { isProfileCompleted: true }
            })
        }

        res.json({
            message: 'Profile updated successfully',
            profile,
            isProfileCompleted: !!isProfileCompleted
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id
        const profile = await (prisma as any).candidateProfile.findUnique({
            where: { candidateId },
            include: {
                candidate: true,
                resumeFile: true
            }
        })

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }

        res.json(profile)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id

        const profile = await (prisma as any).candidateProfile.findUnique({
            where: { candidateId }
        })

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }

        // Delete profile (Prisma will handle relations if set to cascade, 
        // but let's be explicit if needed)
        await (prisma as any).candidateProfile.delete({
            where: { candidateId }
        })

        // Also reset isProfileCompleted on Candidate
        await (prisma as any).candidate.update({
            where: { id: candidateId },
            data: { isProfileCompleted: false }
        })

        res.json({ message: 'Profile deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const updateCandidateProfile = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id
        const { 
            id, 
            candidateId: _, 
            candidate, // Nested candidate object if provided
            fullName,
            email,
            mobile,
            createdAt, 
            updatedAt, 
            resumeFile,
            ...profileData 
        } = req.body

        // 1. Update Candidate basic info if provided
        const candidateUpdateData: any = {}
        if (fullName) candidateUpdateData.fullName = fullName
        if (email) candidateUpdateData.email = email
        if (mobile) candidateUpdateData.mobile = mobile

        if (Object.keys(candidateUpdateData).length > 0) {
            await (prisma as any).candidate.update({
                where: { id: candidateId },
                data: candidateUpdateData
            })
        }

        // 2. Ensure skills is treated as a comma-separated string
        if (profileData.skills) {
            if (Array.isArray(profileData.skills)) {
                profileData.skills = profileData.skills.join(',')
            } else if (typeof profileData.skills !== 'string') {
                profileData.skills = String(profileData.skills)
            }
        }

        // 3. Update Profile data
        const profile = await (prisma as any).candidateProfile.update({
            where: { candidateId },
            data: profileData
        })

        res.json({
            status: 'success',
            message: 'Profile updated successfully',
            profile,
            isProfileCompleted: true
        })
    } catch (error) {
        console.error('Update Profile Error:', error)
        
        // Specific error handling for Prisma
        if ((error as any).code === 'P2025') {
            return res.status(404).json({ 
                status: 'error',
                message: 'Profile not found. Please complete your profile setup first.' 
            })
        }

        if ((error as any).code === 'P2002') {
            return res.status(400).json({
                status: 'error',
                message: 'Email or mobile number already in use.'
            })
        }

        res.status(500).json({ 
            status: 'error',
            message: (error as any).message || 'Internal server error while updating profile' 
        })
    }
}
