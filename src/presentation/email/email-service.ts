import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogSeverityLevel } from '../../domain/entities/log.entity';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachments[];
}

interface Attachments {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    }
  });

  constructor (){};

  async sendMail(options: SendMailOptions): Promise<boolean> {
    const {to, subject, htmlBody, attachments = []} = options;

    try {
      const sendInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });

      const log = {
        message: 'Email was sent',
        level: LogSeverityLevel.low,
        createdAt: new Date(),
        origin: 'email-service.ts'
      }

      return true;

    } catch (err) {

      const log = {
        message: 'Email was not sent',
        level: LogSeverityLevel.high,
        createdAt: new Date(),
        origin: 'email-service.ts'
      }

      return false;

    }
  };

  async sendEmailWithFileSystemLogs (to: string | string[]) {
    const subject = 'Logs del servidor';
    const htmlBody = `
    <h3>Logs del sistema - NOC</h3>
    <p>Lorem ipsum data fetch</p>
    <p>Ver logs adjuntos</p>
    `;

    const attachments: Attachments[] = [
      {filename: 'logs-low.log', path: './logs/logs-low.log'},
      {filename: 'logs-medium.log', path: './logs/logs-medium.log'},
      {filename: 'logs-high.log', path: './logs/logs-high.log'},
    ];

    return this.sendMail({to, subject, attachments, htmlBody});
  }
}