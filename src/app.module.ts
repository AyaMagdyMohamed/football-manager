
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from './modules/cache/cache.module';
import { TeamModule } from './modules/team/team.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { databaseConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    AuthModule,
    CacheModule,
    TeamModule,
    TransfersModule,
  ]
})
export class AppModule {}
