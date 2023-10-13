import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE, // e.g., 'Gmail', 'Outlook'
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to,
            subject,
            text,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw new InternalServerErrorException('Ocorreu um erro ao tentar enviar e-mail.');
        }
    }
}
