import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from '../../infrastructure/database/entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity) private teamRepo: Repository<TeamEntity>
  ) {}

  async getMyTeam(userId: number) {
    const team = await this.teamRepo.findOne({
      where: { user: { id: userId } },
      relations: ['players'],
    });

    if (!team) throw new NotFoundException('Team not found');

    return {
      team: {
        id: team.id,
        budget: team.budget,
        status: team.status,
      },
      players: team.players.map(player => ({
        id: player.id,
        name: player.name,
        position: player.position,
        isForSale: player.isForSale,
      })),
    };
  }
}