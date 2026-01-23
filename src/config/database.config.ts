import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PlayerEntity } from '../infrastructure/database/entities/player.entity';
import { TeamEntity } from '../infrastructure/database/entities/team.entity';
import { UserEntity } from '../infrastructure/database/entities/user.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [UserEntity, TeamEntity, PlayerEntity],
  synchronize: true, // dev only
});
