import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repository/log-impl.repository";
import { CronService } from "./cron/cron-service";

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);

export class Server {

  public static start() {
    console.log('Server started...');
    const url = 'http://localhost:3000/';
    CronService.createJob('*/5 * * * * *', () => {
      new CheckService(
        fileSystemLogRepository,
        undefined,
        undefined
      ).execute(url);
      // new CheckService().execute('http://localhost:3000/');
    });
  }
} 