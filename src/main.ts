
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { startTeamWorker } from './modules/background-jobs/team.worker';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const dataSource = app.get(DataSource);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  startTeamWorker(dataSource, configService);
  const config = new DocumentBuilder()
    .setTitle('Football Manager API')
    .setDescription('Transfer market & team management system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
