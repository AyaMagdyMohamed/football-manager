import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntity } from '../../infrastructure/database/entities/player.entity';
import { TeamEntity } from '../../infrastructure/database/entities/team.entity';
import { Inject } from '@nestjs/common';
import {
  MIN_TEAM_PLAYERS,
  MAX_PLAYER_PRICE
} from './constants';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(PlayerEntity)
    private readonly playerRepo: Repository<PlayerEntity>,
  ) {}

  async sellPlayer(userId: number, playerId: number, askingPrice: number) {

    // 1. Validate price
    if (askingPrice > MAX_PLAYER_PRICE) {
      throw new BadRequestException(
        `Max allowed price is ${MAX_PLAYER_PRICE}`,
      );
    }

    // 2. Load player with relations
    const player = await this.playerRepo.findOne({
      where: { id: playerId },
      relations: ['team', 'team.user', 'team.players'],
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    // 3. Ownership check
    if (player.team.user.id !== userId) {
      throw new ForbiddenException('You do not own this player');
    }

    // 4. Already for sale?
    if (player.isForSale) {
      throw new BadRequestException('Player already for sale');
    }

    // 5. Team size rule
    const teamPlayerCount = player.team.players.length;

    if (teamPlayerCount - 1 < MIN_TEAM_PLAYERS) {
      throw new BadRequestException(
        `Cannot sell player. Team must have at least ${MIN_TEAM_PLAYERS} players.`,
      );
    }

    // 6. Mark as for sale
    player.isForSale = true;
    player.askingPrice = askingPrice;

    await this.playerRepo.save(player);

    return {
      success: true,
      message: 'Player added to transfer market',
      playerId: player.id,
      askingPrice,
    };
  }
}
