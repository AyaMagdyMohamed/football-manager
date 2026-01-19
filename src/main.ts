
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { startTeamWorker } from './modules/background-jobs/team.worker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const dataSource = app.get(DataSource);
  startTeamWorker(dataSource);
  await app.listen(3000);
}
bootstrap();
