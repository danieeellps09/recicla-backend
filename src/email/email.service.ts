import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly transporter;


    constructor(    private configService: ConfigService
        ) {
        this.transporter = nodemailer.createTransport({
            host:  this.configService.get<string>('provedor_email'),
            auth: {
                user: this.configService.get<string>('email_username'),
                pass: this.configService.get<string>('email_password'),
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: this.configService.get<string>('email_username'),
            to,
            subject,
            html:text,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw new InternalServerErrorException('Ocorreu um erro ao tentar enviar e-mail.');
        }
    }
}
