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
            currentStep: 1, // Defaulting to 1 as onboarding is removed
            isProfileCompleted: profile.recruiter.isProfileCompleted,
            isPaid: profile.recruiter.isPaid,
            isActive: (profile.recruiter as any).isActive,
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
            isProfileCompleted, 
            companyName,
            fullName,
            email,
            workEmail, // sometimes used in frontend instead of email
            mobile,
            industry,
            website,
            address,
            city,
            state,
            pinCode,
            gstNumber,
            gstCertificateUrl,
            gstCertificateFileId,
            msmeCertificateUrl,
            msmeCertificateFileId,
            registrationCertificateUrl,
            registrationCertificateFileId
        } = req.body

        // 1. Update Recruiter basic info if provided
        const recruiterUpdateData: any = {}
        if (fullName) recruiterUpdateData.fullName = fullName
        if (email || workEmail) recruiterUpdateData.email = email || workEmail
        if (mobile) recruiterUpdateData.mobile = mobile
        if (companyName) recruiterUpdateData.companyName = companyName
        if (state) recruiterUpdateData.state = state
        if (pinCode) recruiterUpdateData.pinCode = pinCode
        if (isProfileCompleted) recruiterUpdateData.isProfileCompleted = true

        if (Object.keys(recruiterUpdateData).length > 0) {
            await (prisma as any).recruiter.update({
                where: { id: recruiterId },
                data: recruiterUpdateData
            })
        }

        const profileData = {
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
        }

        // 2. Upsert Profile data
        const profile = await (prisma as any).companyProfile.upsert({
            where: { recruiterId },
            update: profileData,
            create: {
                recruiterId,
                ...profileData
            }
        })

        const updatedRecruiter = await (prisma as any).recruiter.findUnique({
            where: { id: recruiterId }
        })

        return res.json({
            status: 'success',
            message: 'Profile updated successfully',
            currentStep: 1,
            isProfileCompleted: updatedRecruiter.isProfileCompleted,
            profile,
            user: updatedRecruiter
        })
    } catch (error) {
        console.error('Update Company Profile Error:', error)
        
        if ((error as any).code === 'P2002') {
            return res.status(400).json({
                status: 'error',
                message: 'Email, mobile number, or GST number already in use.'
            })
        }

        res.status(500).json({ 
            status: 'error',
            message: (error as any).message || 'Internal server error while updating company profile' 
        })
    }
}

export const getCompanyProfile = async (req: Request, res: Response) => {
    try {
        const recruiterId = (req as any).user.id
        const profile = await (prisma as any).companyProfile.findUnique({
            where: { recruiterId },
            include: {
                recruiter: true,
                gstCertificateFile: true,
                msmeCertificateFile: true,
                registrationCertificateFile: true
            }
        })

        if (!profile) {
            const recruiter = await (prisma as any).recruiter.findUnique({
                where: { id: recruiterId }
            })
            
            if (!recruiter) {
                return res.status(404).json({ message: 'User not found' })
            }

            return res.json({
                status: 'success',
                profile: {
                    companyName: recruiter.companyName,
                    address: recruiter.address,
                    city: recruiter.city,
                    state: recruiter.state,
                    pinCode: recruiter.pinCode,
                    recruiter: recruiter
                }
            })
        }

        // Add recruiter fields to the profile object for frontend convenience
        const profileWithRecruiterData = {
            ...profile,
            address: profile.recruiter.address,
            city: profile.recruiter.city,
            state: profile.recruiter.state,
            pinCode: profile.recruiter.pinCode,
            companyName: profile.companyName || profile.recruiter.companyName
        }

        return res.json({
            status: 'success',
            profile: profileWithRecruiterData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
