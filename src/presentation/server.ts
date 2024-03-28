import { LogSeverityLevel } from "../domain/entities/log.entity";
import { CheckService } from "../domain/use-cases/checks/check-service";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service -multiple";
import { SendEmailLogs } from "../domain/use-cases/emails/send-email-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDataSource } from "../infrastructure/datasources/postgres-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repository/log-impl.repository";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";

const fsLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);

const mongoLogRepository = new LogRepositoryImpl(
  new MongoLogDatasource()
);

const postgresLogRepository = new LogRepositoryImpl(
  new PostgresLogDataSource()
);

const emailService = new EmailService();

export class Server {

  public static async start() {
    console.log('Server started...');

    // Mandar un email

    // new SendEmailLogs(emailService, fileSystemLogRepository).execute(['marlon.zarate@pidelectronics.com']);

    // emailService.sendEmailWithFileSystemLogs(['marlon.zarate@pidelectronics.com']);

    // const logs = await logRepository.getLogs(LogSeverityLevel.high);
    // console.log(logs);

    const url = 'http://www.google.com';
    console.log(url);
    CronService.createJob('*/5 * * * * *', () => {
      new CheckServiceMultiple(
        [fsLogRepository,mongoLogRepository,postgresLogRepository],
        undefined,
        undefined
      ).execute(url);
      // new CheckService().execute('http://localhost:3000/');
    });
  }
} 