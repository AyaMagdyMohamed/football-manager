
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserEntity } from './infrastructure/database/entities/user.entity';
import { TeamEntity } from './infrastructure/database/entities/team.entity';
import { PlayerEntity } from './infrastructure/database/entities/player.entity';
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
