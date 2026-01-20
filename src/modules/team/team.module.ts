import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from '../../infrastructure/database/entities/team.entity';
import { JwtAuthModule } from '../../jwt/jwt.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity]), JwtAuthModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}