import { Request, Response } from 'express'
import prisma from '../../../config/db'

export const getProfileStatus = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id

        const profile = await (prisma as any).companyProfile.findUnique({
            where: { recruiterId },
            include: {
                recruiter: {
                    select: {
                        isProfileCompleted: true
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
            isProfileCompleted: profile.recruiter.isProfileCompleted,
            data: profile
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const updateCompanyProfile = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id
        const { 
            onboardingStep, 
            isProfileCompleted, 
            companyName,
            industry,
            website,
            address,
            city,
            state,
            gstNumber,
            gstCertificateUrl,
            gstCertificateFileId,
            msmeCertificateUrl,
            msmeCertificateFileId,
            registrationCertificateUrl,
            registrationCertificateFileId
        } = req.body

        const profileData = {
            onboardingStep: onboardingStep || undefined,
            companyName, // Added to schema now
            industry,
            website,
            address,
            city,
            state,
            gstNumber,
            gstCertificateUrl,
            gstCertificateFileId,
            msmeCertificateUrl,
            msmeCertificateFileId,
            registrationCertificateUrl,
            registrationCertificateFileId
        }

        const profile = await (prisma as any).companyProfile.upsert({
            where: { recruiterId },
            update: profileData,
            create: {
                recruiterId,
                ...profileData,
                onboardingStep: onboardingStep || 1
            }
        })

        // Also update the Recruiter's main companyName if provided
        const recruiterUpdateData: any = {}
        if (companyName) recruiterUpdateData.companyName = companyName
        if (isProfileCompleted) recruiterUpdateData.isProfileCompleted = true

        if (Object.keys(recruiterUpdateData).length > 0) {
            await (prisma as any).recruiter.update({
                where: { id: recruiterId },
                data: recruiterUpdateData
            })
        }

        const updatedRecruiter = await (prisma as any).recruiter.findUnique({
            where: { id: recruiterId }
        })

        return res.json({
            status: 'success',
            message: 'Profile updated successfully',
            currentStep: profile.onboardingStep,
            isProfileCompleted: updatedRecruiter.isProfileCompleted,
            profile
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const getCompanyProfile = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id
        const profile = await (prisma as any).companyProfile.findUnique({
            where: { recruiterId },
            include: {
                gstCertificateFile: true,
                msmeCertificateFile: true,
                registrationCertificateFile: true
            }
        })

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }

        return res.json({
            status: 'success',
            profile
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
