import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { supabase } from '../../../utils/supabase'
import prisma from '../../../config/db'
import { generateToken } from '../../../utils/jwt'
import bcrypt from 'bcryptjs'

export const googleCallback = async (req: Request, res: Response) => {
    const logFile = path.join(__dirname, '../../../../auth_debug.log')
    const log = (msg: string) => fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`)

    try {
        log(`Full URL: ${req.originalUrl}`)
        log(`Query Params: ${JSON.stringify(req.query)}`)
        
        const { code, role, error: queryError, error_description } = req.query as { code: string, role: string, error: string, error_description: string }
        
        if (queryError) {
            log(`Query Error: ${queryError} - ${error_description}`)
        }

        log(`Callback hit with role: ${role}, code: ${code ? 'PRESENT' : 'MISSING'}`)
        
        if (!code) {
            log('Error: No code provided in query')
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`)
        }

        // Exchange code for session
        log('Exchanging code for session...')
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error || !data.user) {
            log(`Supabase error: ${JSON.stringify(error)}`)
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`)
        }

        const { email, user_metadata } = data.user
        const fullName = user_metadata?.full_name || user_metadata?.name || 'Google User'
        log(`User data from Supabase: email=${email}, name=${fullName}`)

        let user: any = null

        try {
            if (role === 'RECRUITER') {
                log(`Searching for Recruiter with email: ${email}`)
                user = await prisma.recruiter.findUnique({ where: { email } })
                if (!user) {
                    log(`Creating new Recruiter: ${email}`)
                    user = await prisma.recruiter.create({
                        data: {
                            email: email!,
                            fullName,
                            companyName: 'Not Provided',
                            mobile: 'Not Provided',
                            password: '', 
                            isVerified: true,
                            role: 'RECRUITER'
                        }
                    })
                    log(`New Recruiter created: ${user.id}`)
                } else {
                    log(`Recruiter found: ${user.id}`)
                }
            } else {
                log(`Searching for Candidate with email: ${email}`)
                user = await prisma.candidate.findUnique({ where: { email } })
                if (!user) {
                    log(`Creating new Candidate: ${email}`)
                    user = await prisma.candidate.create({
                        data: {
                            email: email!,
                            fullName,
                            mobile: 'Not Provided',
                            password: '', 
                            isVerified: true,
                            role: 'CANDIDATE'
                        }
                    })
                    log(`New Candidate created: ${user.id}`)
                } else {
                    log(`Candidate found: ${user.id}`)
                }
            }
        } catch (prismaErr: any) {
            log(`Prisma Error: ${prismaErr.message}`)
            throw prismaErr
        }

        // Establish session
        log(`Generating token for user: ${user.id} with role: ${user.role}`)
        const token = generateToken(user.id, user.role)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Use 'lax' for cross-site auth flows
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        log('Success! Redirecting to dashboard')
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`)

    } catch (error: any) {
        log(`FATAL ERROR: ${error.message}\n${error.stack}`)
        res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`)
    }
}

export const syncGoogleUser = async (req: Request, res: Response) => {
    const logFile = path.join(__dirname, '../../../../auth_debug.log')
    const log = (msg: string) => fs.appendFileSync(logFile, `${new Date().toISOString()} - SYNC: ${msg}\n`)

    try {
        const { email, fullName, role } = req.body
        log(`Sync request for: ${email}, role: ${role}`)

        let user: any = null

        try {
            // First, check if user exists in ANY table to respect existing role
            const existingCandidate = await prisma.candidate.findUnique({ where: { email } });
            const existingRecruiter = await prisma.recruiter.findUnique({ where: { email } });

            if (existingRecruiter) {
                log(`Existing Recruiter found: ${existingRecruiter.id}. Respecting role.`);
                user = await prisma.recruiter.update({
                    where: { email },
                    data: { fullName }
                });
            } else if (existingCandidate) {
                log(`Existing Candidate found: ${existingCandidate.id}. Respecting role.`);
                user = await prisma.candidate.update({
                    where: { email },
                    data: { fullName }
                });
            } else {
                // New user - use the requested role
                if (role === 'RECRUITER') {
                    log(`Creating new Recruiter: ${email}`);
                    user = await prisma.recruiter.create({
                        data: {
                            email: email!,
                            fullName,
                            companyName: 'Not Provided',
                            mobile: 'Not Provided',
                            password: '', 
                            isVerified: true,
                            role: 'RECRUITER'
                        }
                    });
                } else {
                    log(`Creating new Candidate: ${email}`);
                    user = await prisma.candidate.create({
                        data: {
                            email: email!,
                            fullName,
                            mobile: 'Not Provided',
                            password: '', 
                            isVerified: true,
                            role: 'CANDIDATE'
                        }
                    });
                }
            }
        } catch (dbError: any) {
            log(`Database error: ${dbError.message}`)
            return res.status(500).json({ status: 'error', message: 'Database synchronization failed' })
        }

        if (!user) {
            log('Error: User could not be found or created')
            return res.status(404).json({ status: 'error', message: 'User not found' })
        }

        const needsCompletion = !user.password;
        log(`Sync success for user ${user.id}. Needs completion: ${needsCompletion}`)

        const token = generateToken(user.id, user.role)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ 
            status: 'success', 
            message: 'User synchronized successfully',
            needsCompletion,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isProfileCompleted: (user as any).isProfileCompleted
            }
        })

    } catch (error: any) {
        log(`Fatal sync error: ${error.message}`)
        return res.status(500).json({ status: 'error', message: 'Server synchronization error' })
    }
}

export const completeProfile = async (req: Request, res: Response) => {
    const logFile = path.join(__dirname, '../../auth_debug.log')
    const log = (msg: string) => fs.appendFileSync(logFile, `${new Date().toISOString()} - COMPLETE: ${msg}\n`)

    try {
        const { id, role, mobile, password, companyName } = req.body
        log(`Completing profile for user: ${id}, role: ${role}`)

        let user: any = null
        
        let hashedPassword = password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        if (role === 'RECRUITER') {
            user = await prisma.recruiter.update({
                where: { id },
                data: {
                    mobile,
                    password: hashedPassword,
                    companyName,
                    isVerified: true
                }
            })
        } else {
            user = await prisma.candidate.update({
                where: { id },
                data: {
                    mobile,
                    password: hashedPassword,
                    isVerified: true
                }
            })
        }

        log(`Profile completed for user: ${user.id}`)
        return res.status(200).json({ 
            status: 'success', 
            message: 'Profile completed successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isProfileCompleted: (user as any).isProfileCompleted
            }
        })

    } catch (error: any) {
        log(`Fatal profile completion error: ${error.message}`)
        return res.status(500).json({ status: 'error', message: 'Profile completion failed' })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token')
        res.json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}
