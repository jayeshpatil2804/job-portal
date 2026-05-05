import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getProfileStatus = async (req: Request, res: Response) => {
    try {
        const candidateId = (req as any).user.id

        // Using (prisma as any) to bypass IDE type lag after schema update
        const candidate = await (prisma as any).candidate.findUnique({
            where: { id: candidateId },
            select: {
                isProfileCompleted: true,
                isActive: true
            }
        })

        if (!candidate) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.json({
            currentStep: 1, // Defaulting to 1 as onboarding is removed
            isProfileCompleted: candidate.isProfileCompleted,
            isActive: candidate.isActive,
            data: {}
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
            isProfileCompleted, 
            id, 
            candidateId: _, 
            candidate, 
            createdAt, 
            updatedAt, 
            // Exclude Candidate-model fields that don't belong in CandidateProfile
            email,
            role,
            isActive,
            isVerified,
            mobile,
            fullName,
            address,
            city,
            state,
            pinCode,
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

        // 1. Update Candidate model fields if provided
        const candidateUpdateData: any = {}
        if (address) candidateUpdateData.address = address
        if (city) candidateUpdateData.city = city
        if (state) candidateUpdateData.state = state
        if (pinCode) candidateUpdateData.pinCode = pinCode
        if (isProfileCompleted) candidateUpdateData.isProfileCompleted = true

        if (Object.keys(candidateUpdateData).length > 0) {
            await (prisma as any).candidate.update({
                where: { id: candidateId },
                data: candidateUpdateData
            })
        }

        // 2. Update Profile model fields
        const profile = await (prisma as any).candidateProfile.upsert({
            where: { candidateId },
            update: data,
            create: {
                candidateId,
                ...data
            }
        })

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
        
        // Try to find the profile
        let profile = await (prisma as any).candidateProfile.findUnique({
            where: { candidateId },
            include: {
                candidate: true
            }
        })

        // If no profile record exists yet, return the base candidate data
        if (!profile) {
            const candidate = await (prisma as any).candidate.findUnique({
                where: { id: candidateId }
            })
            
            if (!candidate) {
                return res.status(404).json({ message: 'User not found' })
            }

            return res.json({
                candidate,
                candidateId: candidate.id,
                isExperienced: false,
                skills: '',
                // other default fields
            })
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
            ...profileData 
        } = req.body

        // 1. Update Candidate basic info if provided
        const candidateUpdateData: any = {}
        if (fullName) candidateUpdateData.fullName = fullName
        if (email) candidateUpdateData.email = email
        if (mobile) candidateUpdateData.mobile = mobile
        if (profileData.address) {
            candidateUpdateData.address = profileData.address
            delete profileData.address
        }
        if (profileData.city) {
            candidateUpdateData.city = profileData.city
            delete profileData.city
        }
        if (profileData.state) {
            candidateUpdateData.state = profileData.state
            delete profileData.state
        }
        if (profileData.pinCode) {
            candidateUpdateData.pinCode = profileData.pinCode
            delete profileData.pinCode
        }

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

        // 3. Update Profile data (using upsert in case it doesn't exist yet)
        const profile = await (prisma as any).candidateProfile.upsert({
            where: { candidateId },
            update: profileData,
            create: {
                candidateId,
                ...profileData
            }
        })

        const updatedCandidate = await (prisma as any).candidate.findUnique({
            where: { id: candidateId }
        })

        res.json({
            status: 'success',
            message: 'Profile updated successfully',
            profile,
            user: updatedCandidate,
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
