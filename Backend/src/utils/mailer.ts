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
