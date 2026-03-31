import { Request, Response } from 'express'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export const sendEnquiry = async (req: Request, res: Response) => {
    try {
        const { name, email, mobile, subject, message } = req.body

        if (!name || !email || !mobile || !message || !subject) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        const senderEmail = process.env.SENDER_EMAIL || 'support@losodhan.com'

        // 1. Send email to support@losodhan.com
        const supportMailOptions = {
            from: senderEmail,
            to: 'support@losodhan.com',
            subject: `New Portal Enquiry: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #1a3c8f;">New Enquiry Received</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Mobile:</strong> ${mobile}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: none; border-top: 1px solid #eee; my-4;" />
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `
        }

        // 2. Send auto-reply to the user
        const autoReplyOptions = {
            from: senderEmail,
            to: email,
            subject: 'We have received your enquiry - LOSODHAN',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #1a3c8f;">Hello ${name},</h2>
                    <p>Thank you for contacting LOSODHAN. We have received your message regarding <strong>${subject}</strong>.</p>
                    <p>Our team is reviewing your inquiry and will get back to you as soon as possible.</p>
                    <p>For urgent matters, please feel free to reach out to us directly at support@losodhan.com or info@losodhan.com.</p>
                    <br/>
                    <p>Best Regards,</p>
                    <p><strong>The LOSODHAN Team</strong></p>
                </div>
            `
        }

        // Send both emails using Promise.all
        await Promise.all([
            sgMail.send(supportMailOptions),
            sgMail.send(autoReplyOptions)
        ])

        return res.status(200).json({ success: true, message: 'Enquiry sent successfully' })
    } catch (error: any) {
        console.error('Contact form submission error:', error)
        
        // Log SendGrid specific error details if available
        if (error.response) {
            console.error('SendGrid Error details:', error.response.body)
        }
        
        return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' })
    }
}
