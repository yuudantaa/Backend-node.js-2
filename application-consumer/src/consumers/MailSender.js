import nodemailer from 'nodemailer';

class MailSender {
    constructor() {
        this._transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT, 10),
            secure: process.env.MAIL_PORT === '1234', 
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    sendEmail(targetEmail, subject, htmlContent) {
        const message = {
            from: `"Job Portal" <${process.env.MAIL_USER}>`,
            to: targetEmail,
            subject,
            html: htmlContent,
        };

        return this._transporter.sendMail(message);
    }
}

export default MailSender;