import { createTransport } from 'nodemailer'

interface EmailOptions {
    to: string
    subject: string
    text: string
    html?: string
}

export async function sendEmail(options: EmailOptions) {
    const smtpHost = process.env.SMTP_HOST || ''
    const smtpPort = Number(process.env.SMTP_PORT || 0)
    const smtpSecure = process.env.SMTP_USER === 'true'
    const smtpUser = process.env.SMTP_USER || ''
    const smtpPassword = process.env.SMTP_PASSWORD || ''

    if (!smtpHost || !smtpUser || !smtpPassword) {
        throw new Error('SMTP configuration is missing')
    }

    let transporter = createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: smtpUser,
            pass: smtpPassword,
        },
    })

    // Setup email data
    let mailOptions = {
        from: '"EduSocial" <edusocial@felipesobral.com.br>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    }

    // Send mail with defined transport object
    await transporter.sendMail(mailOptions)
}
