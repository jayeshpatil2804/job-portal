import cron from 'node-cron'
import prisma from '../config/db'

/**
 * Daily Subscription Cron Job
 * Runs every day at midnight (00:00)
 * - Deactivates expired subscriptions (isPaid=false, isActive=false)
 * - Creates notifications for:
 *   - Users whose subscription expired today
 *   - Users whose subscription expires within 30 days (warning)
 */
export const startSubscriptionCron = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('[Cron] Running subscription expiry check...')

        const now = new Date()

        // ─── 1. Find all expired subscriptions ────────────────────────────────
        const thirtyDaysFromNow = new Date(now)
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

        // ─── 2. Handle expired CANDIDATES ─────────────────────────────────────
        const expiredCandidates = await (prisma.candidate as any).findMany({
            where: {
                subscriptionExpiryDate: {
                    lt: now
                },
                isPaid: true // only those who were previously paid
            },
            select: { id: true, fullName: true, subscriptionExpiryDate: true }
        })

        for (const candidate of expiredCandidates) {
            // Deactivate
            await (prisma.candidate as any).update({
                where: { id: candidate.id },
                data: {
                    isPaid: false,
                    isActive: false
                }
            })

            // Check if EXPIRED notification already sent today
            const alreadyNotified = await prisma.notification.findFirst({
                where: {
                    candidateId: candidate.id,
                    type: 'SUBSCRIPTION_EXPIRED',
                    createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) }
                }
            })

            if (!alreadyNotified) {
                await prisma.notification.create({
                    data: {
                        type: 'SUBSCRIPTION_EXPIRED',
                        message: `Aapka subscription expire ho gaya hai. Please renew karo apna plan.`,
                        candidateId: candidate.id,
                    }
                })
            }

            console.log(`[Cron] Candidate expired & deactivated: ${candidate.id}`)
        }

        // ─── 3. Handle expired RECRUITERS ─────────────────────────────────────
        const expiredRecruiters = await (prisma.recruiter as any).findMany({
            where: {
                subscriptionExpiryDate: {
                    lt: now
                },
                isPaid: true
            },
            select: { id: true, fullName: true, companyName: true, subscriptionExpiryDate: true }
        })

        for (const recruiter of expiredRecruiters) {
            // Deactivate
            await (prisma.recruiter as any).update({
                where: { id: recruiter.id },
                data: {
                    isPaid: false,
                    isActive: false
                }
            })

            const alreadyNotified = await prisma.notification.findFirst({
                where: {
                    recruiterId: recruiter.id,
                    type: 'SUBSCRIPTION_EXPIRED',
                    createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) }
                }
            })

            if (!alreadyNotified) {
                await prisma.notification.create({
                    data: {
                        type: 'SUBSCRIPTION_EXPIRED',
                        message: `Aapka subscription expire ho gaya hai. Please apna plan renew karo.`,
                        recruiterId: recruiter.id,
                    }
                })
            }

            console.log(`[Cron] Recruiter expired & deactivated: ${recruiter.id} (${recruiter.companyName})`)
        }

        // ─── 4. Warning: Candidates expiring in ≤30 days ─────────────────────
        const expiringCandidates = await (prisma.candidate as any).findMany({
            where: {
                subscriptionExpiryDate: {
                    gte: now,
                    lte: thirtyDaysFromNow
                },
                isPaid: true
            },
            select: { id: true, subscriptionExpiryDate: true }
        })

        for (const candidate of expiringCandidates) {
            const daysLeft = Math.ceil(
                (new Date(candidate.subscriptionExpiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )

            // Only send once per day (check not already created today)
            const alreadyNotified = await prisma.notification.findFirst({
                where: {
                    candidateId: candidate.id,
                    type: 'SUBSCRIPTION_EXPIRING',
                    createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) }
                }
            })

            if (!alreadyNotified) {
                await prisma.notification.create({
                    data: {
                        type: 'SUBSCRIPTION_EXPIRING',
                        message: `Aapka subscription sirf ${daysLeft} din me expire hoga. Abhi renew karo!`,
                        candidateId: candidate.id,
                    }
                })
            }
        }

        // ─── 5. Warning: Recruiters expiring in ≤30 days ─────────────────────
        const expiringRecruiters = await (prisma.recruiter as any).findMany({
            where: {
                subscriptionExpiryDate: {
                    gte: now,
                    lte: thirtyDaysFromNow
                },
                isPaid: true
            },
            select: { id: true, subscriptionExpiryDate: true }
        })

        for (const recruiter of expiringRecruiters) {
            const daysLeft = Math.ceil(
                (new Date(recruiter.subscriptionExpiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )

            const alreadyNotified = await prisma.notification.findFirst({
                where: {
                    recruiterId: recruiter.id,
                    type: 'SUBSCRIPTION_EXPIRING',
                    createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) }
                }
            })

            if (!alreadyNotified) {
                await prisma.notification.create({
                    data: {
                        type: 'SUBSCRIPTION_EXPIRING',
                        message: `Aapka subscription sirf ${daysLeft} din me expire hoga. Abhi renew karo!`,
                        recruiterId: recruiter.id,
                    }
                })
            }
        }

        console.log(`[Cron] Subscription check done. Expired candidates: ${expiredCandidates.length}, Expired recruiters: ${expiredRecruiters.length}`)
    })

    console.log('[Cron] Subscription expiry cron job registered (runs daily at midnight)')
}
