import { PrismaClient, SeverityLevel } from "@prisma/client";
import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

const prismaClient = new PrismaClient();

const serverityEnum = {
  low: SeverityLevel.LOW,
  medium: SeverityLevel.MEDIUM,
  high: SeverityLevel.HIGH
};

export class PostgresLogDataSource implements LogDataSource {
  async saveLog(log: LogEntity): Promise<void> {

    const level = serverityEnum[log.level];
    const newLog = await prismaClient.logModel.create({
      data: {
        ...log,
        level: level,
      }
    });
    console.log('Postgres saved');
  }
  
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const level = serverityEnum[severityLevel];
    const logs = await prismaClient.logModel.findMany({
      where: {
        level: level,
      }
    });
    return logs.map(log => LogEntity.fromObject(log));
  }

}