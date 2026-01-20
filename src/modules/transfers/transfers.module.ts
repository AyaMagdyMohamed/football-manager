import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { PlayerEntity } from '../../infrastructure/database/entities/player.entity';
import { TeamEntity } from '../../infrastructure/database/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerEntity, TeamEntity])],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
