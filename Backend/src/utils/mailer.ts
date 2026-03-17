import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'

export const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendOtpEmail = async (email: string, otp: string) => {
    try {
        // Always log OTP to console for debugging in development
        console.log(`[OTP DEBUG] To: ${email} | Code: ${otp}`)

        const msg = {
            to: email,
            from: SENDER_EMAIL, 
            subject: 'Your Verification Code - Losodhan',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #1a3c8f; text-align: center;">Email Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for choosing Losodhan. Please use the following One-Time Password (OTP) to verify your account. This code is valid for 10 minutes.</p>
                    <div style="background: #f8fafc; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a3c8f;">${otp}</span>
                    </div>
                    <p style="font-size: 14px; color: #64748b;">If you didn't request this code, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2026 Losodhan. All rights reserved.</p>
                </div>
            `,
        }

        await sgMail.send(msg)
        console.log(`[EMAIL SENT] To: ${email} via SendGrid`)
        return true
    } catch (error: any) {
        console.error('SendGrid error:', error.response?.body || error)
        // Even if email fails, we return true in development so the UI can proceed if the dev sees the log
        return process.env.NODE_ENV !== 'production'
    }
}

export const sendInterviewEmail = async (email: string, details: {
    jobTitle: string,
    company: string,
    date: string,
    time: string,
    mode: string,
    location: string,
    notes?: string
}) => {
    try {
        console.log(`[INTERVIEW EMAIL DEBUG] To: ${email} | Job: ${details.jobTitle}`)

        const msg = {
            to: email,
            from: SENDER_EMAIL,
            subject: `Interview Scheduled: ${details.jobTitle} at ${details.company}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1a3c8f; margin: 0; font-size: 24px;">Interview Invitation</h1>
                        <p style="color: #64748b; margin-top: 5px;">Congratulations! Your application has been shortlisted.</p>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
                        <h3 style="margin-top: 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Interview Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px;">Job Role:</td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: bold;">${details.jobTitle}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Company:</td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: bold;">${details.company}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date:</td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: bold;">${details.date}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Time:</td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: bold;">${details.time}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mode:</td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: bold; text-transform: uppercase;">${details.mode}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">${details.mode === 'ONLINE' ? 'Link:' : 'Location:'}</td>
                                <td style="padding: 8px 0; color: #1a3c8f; font-size: 14px; font-weight: bold;">
                                    ${details.mode === 'ONLINE' ? `<a href="${details.location}" style="color: #1a3c8f;">Join Meeting</a>` : details.location}
                                </td>
                            </tr>
                        </table>
                    </div>

                    ${details.notes ? `
                    <div style="margin-bottom: 30px;">
                        <h4 style="margin: 0 0 10px 0; color: #0f172a;">Additional Notes:</h4>
                        <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">${details.notes}</p>
                    </div>
                    ` : ''}

                    <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 40px;">
                        Good luck with your interview!<br/>
                        <b>Team Losodhan</b>
                    </p>
                </div>
            `,
        }

        await sgMail.send(msg)
        console.log(`[INTERVIEW EMAIL SENT] To: ${email}`)
        return true
    } catch (error: any) {
        console.error('SendGrid Interview Email error:', error.response?.body || error)
        return process.env.NODE_ENV !== 'production'
    }
}
