import { Body, Controller, Post, Req, UseGuards, Get, Query } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { SellPlayerDto } from './dto/sell-player.dto';
import { AuthGuard } from '@nestjs/passport';
import { BuyPlayerDto } from './dto/buy-player.dto';
import { MarketFilterDto } from './dto/market-filter.dto';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('sell')
  sellPlayer(@Body() dto: SellPlayerDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.transfersService.sellPlayer(
      userId,
      dto.playerId,
      dto.askingPrice,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('buy')
  buyPlayer(@Body() dto: BuyPlayerDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.transfersService.buyPlayer(userId, dto.playerId);
  }

  @Get()
  getMarket(@Query() filters: MarketFilterDto) {
    return this.transfersService.getMarketPlayers(filters);
  }

}
