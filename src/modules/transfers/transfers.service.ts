import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PlayerEntity } from '../../infrastructure/database/entities/player.entity';
import { TeamEntity } from '../../infrastructure/database/entities/team.entity';
import { Inject } from '@nestjs/common';
import {
  MIN_TEAM_PLAYERS,
  MAX_PLAYER_PRICE
} from './constants';

import { CacheService } from '../cache/interfaces/cache.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);
  constructor(
      @InjectRepository(PlayerEntity)
      private readonly playerRepo: Repository<PlayerEntity>,
      @InjectRepository(TeamEntity)
      private readonly teamRepo: Repository<TeamEntity>,

     @Inject('CacheService')
     private readonly cache: CacheService,
     private readonly dataSource: DataSource,
     
      
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
    await this.cache.del('transfer_market'); // Invalidate cache

    return {
      success: true,
      message: 'Player added to transfer market',
      playerId: player.id,
      askingPrice,
    };
  }

async buyPlayer(userId: number, playerId: number) {
  return this.dataSource.transaction(async manager => {
    const playerRepo = manager.getRepository(PlayerEntity);
    const teamRepo = manager.getRepository(TeamEntity);

    // 1) Lock player row ONLY
    const player = await playerRepo.findOne({
      where: { id: playerId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!player) throw new NotFoundException('Player not found');
    if (!player.isForSale) throw new BadRequestException('Player not for sale');

    // 2) Lock seller team (NO relations)
    const sellerTeam = await teamRepo.findOne({
      where: { id: player.teamId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!sellerTeam) throw new NotFoundException('Seller team not found');

    // 3) Lock buyer team (NO relations)
    const buyerTeam = await teamRepo.findOne({
      where: { user: { id: userId } },
      lock: { mode: 'pessimistic_write' },
    });

    if (!buyerTeam) throw new NotFoundException('Buyer team not found');
    if (buyerTeam.id === sellerTeam.id) {
      throw new BadRequestException('Cannot buy your own player');
    }

    // 4) Count players separately (safe)
    const sellerCount = await playerRepo.count({
      where: { teamId: sellerTeam.id },
    });

    const buyerCount = await playerRepo.count({
      where: { teamId: buyerTeam.id },
    });

    // 5) Team size rules
    if (buyerCount + 1 > 25) {
      throw new BadRequestException('Buyer team already has 25 players');
    }

    if (sellerCount - 1 < 15) {
      throw new BadRequestException('Seller team would drop below 15 players');
    }

    // 6) Price (95%)
    const price = Math.floor(player.askingPrice * 0.95);

    if (buyerTeam.budget < price) {
      throw new BadRequestException('Not enough budget');
    }

    // 7) Transfer money
    buyerTeam.budget -= price;
    sellerTeam.budget += price;

    // 8) Transfer ownership
    player.teamId = buyerTeam.id;
    player.isForSale = false;
    player.askingPrice = null;

    // 9) Save
    await teamRepo.save([buyerTeam, sellerTeam]);
    await playerRepo.save(player);

   await this.cache.del('transfer_market'); // Invalidate cache

    return {
      success: true,
      paid: price,
      playerId: player.id,
    };
  });
}

async getMarketPlayers(filters: any) {
  let disableCache = false;  
  const qb = this.playerRepo
    .createQueryBuilder('player')
    .innerJoinAndSelect('player.team', 'team')
    .where('player.isForSale = true');

  if (filters.playerName) {
    qb.andWhere('LOWER(player.name) LIKE LOWER(:playerName)', {
      playerName: `%${filters.playerName}%`,
    });
  }

  if (filters.teamName) {
    qb.andWhere('LOWER(team.id::text) LIKE LOWER(:teamName)', {
      teamName: `%${filters.teamName}%`,
    });
  }

  if (filters.position) {
    qb.andWhere('player.position LIKE (:position)', {
      position: `%${filters.position}%`,
    });
  }

  if (filters.minPrice) {
    qb.andWhere('player.askingPrice >= :minPrice', {
      minPrice: filters.minPrice,
    });
  }

    if (filters.maxPrice) {
      qb.andWhere('player.askingPrice <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

  if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
  }

  if (Object.keys(filters).length > 0) {
    disableCache = true;
  }
  if (!disableCache) {
    const cached = await this.cache.get('transfer_market');
    if (cached){
      this.logger.debug({
        event: 'transfer_market_fetch',
        source: 'cache',  
        result: cached,
        modules: 'TransfersService',
      });
      return cached;
    }
  }
  

  const players = await qb.getMany();
  this.logger.debug({
    event: 'transfer_market_fetch',
    source: 'database',
    resultCount: players.length,
    modules: 'TransfersService',
  });
  const result = players.map(p => ({
      playerId: p.id,
      name: p.name,
      position: p.position,
      askingPrice: p.askingPrice,
      team: {
        id: p.team.id,
        name: p.team.name,
       },
    }));

  if (!disableCache) await this.cache.set('transfer_market', result, 60);
  return result;
}

}

