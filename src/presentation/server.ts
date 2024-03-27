import { CheckService } from "../domain/use-cases/checks/check-service";
import { SendEmailLogs } from "../domain/use-cases/emails/send-email-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repository/log-impl.repository";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);

const emailService = new EmailService();

export class Server {

  public static start() {
    console.log('Server started...');

    // Mandar un email

    new SendEmailLogs(emailService, fileSystemLogRepository).execute(['marlon.zarate@pidelectronics.com']);

    // emailService.sendEmailWithFileSystemLogs(['marlon.zarate@pidelectronics.com']);

    // const url = 'http://localhost:3000/';
    // CronService.createJob('*/5 * * * * *', () => {
    //   new CheckService(
    //     fileSystemLogRepository,
    //     undefined,
    //     undefined
    //   ).execute(url);
    //   // new CheckService().execute('http://localhost:3000/');
    // });
  }
} 