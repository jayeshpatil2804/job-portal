import { Request, Response } from "express"
import { supabase } from "../../../utils/supabase"
import prisma from "../../../config/db"
import { generateToken } from "../../../utils/jwt"
import bcrypt from "bcryptjs"

export const googleCallback = async (req: Request, res: Response) => {
    try {

        const { code, role } = req.query as { code: string, role: string }

        if (!code) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`)
        }

        // Exchange Google OAuth code with Supabase session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error || !data?.user) {
            console.error("Supabase OAuth Error:", error)
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`)
        }

        const email = data.user.email
        const fullName =
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            "Google User"

        if (!email) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_email`)
        }

        let user: any = null

        // 🔎 Check existing user
        const existingCandidate = await prisma.candidate.findUnique({
            where: { email }
        })

        const existingRecruiter = await prisma.recruiter.findUnique({
            where: { email }
        })

        if (existingRecruiter) {
            user = existingRecruiter
        } else if (existingCandidate) {
            user = existingCandidate
        } else {

            // 🆕 Create new user
            if (role === "RECRUITER") {
                user = await prisma.recruiter.create({
                    data: {
                        email,
                        fullName,
                        companyName: "Not Provided",
                        mobile: "Not Provided",
                        password: "",
                        role: "RECRUITER",
                        isVerified: true
                    }
                })
            } else {
                user = await prisma.candidate.create({
                    data: {
                        email,
                        fullName,
                        mobile: "Not Provided",
                        password: "",
                        role: "CANDIDATE",
                        isVerified: true
                    }
                })
            }
        }

        // 🔑 Generate JWT
        const token = generateToken(user.id, user.role)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        // 🚀 Redirect user to frontend dashboard
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard`)

    } catch (error: any) {

        console.error("Google OAuth Fatal Error:", error)

        return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`)
    }
}

export const syncGoogleUser = async (req: Request, res: Response) => {

    try {

        const { email, fullName, role } = req.body

        if (!email) {
            return res.status(400).json({
                status: "error",
                message: "Email required"
            })
        }

        let user: any

        const candidate = await prisma.candidate.findUnique({ where: { email } })
        const recruiter = await prisma.recruiter.findUnique({ where: { email } })

        if (candidate) {
            user = candidate
        } else if (recruiter) {
            user = recruiter
        } else {

            if (role === "RECRUITER") {
                user = await prisma.recruiter.create({
                    data: {
                        email,
                        fullName,
                        companyName: "Not Provided",
                        mobile: "Not Provided",
                        password: "",
                        role: "RECRUITER",
                        isVerified: true
                    }
                })
            } else {
                user = await prisma.candidate.create({
                    data: {
                        email,
                        fullName,
                        mobile: "Not Provided",
                        password: "",
                        role: "CANDIDATE",
                        isVerified: true
                    }
                })
            }

        }

        const token = generateToken(user.id, user.role)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        return res.json({
            status: "success",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isProfileCompleted: user.isProfileCompleted
            },
            needsCompletion: !user.password
        })

    } catch (err) {

        console.error("Sync Error:", err)

        return res.status(500).json({
            status: "error",
            message: "Server error"
        })
    }

}

export const completeProfile = async (req: Request, res: Response) => {
    try {
        const { id, role, mobile, password, companyName } = req.body

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
        console.error(`Fatal profile completion error: ${error.message}`)
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
