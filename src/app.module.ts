
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserEntity } from './infrastructure/database/entities/user.entity';
import { TeamEntity } from './infrastructure/database/entities/team.entity';
import { PlayerEntity } from './infrastructure/database/entities/player.entity';
import { CacheModule } from './modules/cache/cache.module';   

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'fantasy',
      entities: [UserEntity, TeamEntity, PlayerEntity],
      synchronize: true
    }),
    AuthModule,
    CacheModule
  ]
})
export class AppModule {}
