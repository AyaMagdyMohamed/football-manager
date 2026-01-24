import { Body, Controller, Post, Req, UseGuards, Get, Query } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { SellPlayerDto } from './dto/sell-player.dto';
import { AuthGuard } from '@nestjs/passport';
import { BuyPlayerDto } from './dto/buy-player.dto';
import { MarketFilterDto } from './dto/market-filter.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Transfers')
@ApiBearerAuth()
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @ApiOperation({ summary: 'Sell a player' })
  
  @ApiOperation({ summary: 'Sell a player' })
  @ApiResponse({
  status: 200,
  description: 'Player successfully listed on transfer market',
  schema: {
    example: {
      success: true,
      message: 'Player added to transfer market',
      playerId: 12,
      askingPrice: 1000000,
    },
  },
})
@ApiResponse({
  status: 400,
  description: 'Business rule validation failed',
  schema: {
    example: {
      statusCode: 400,
      message: 'Player already for sale',
      error: 'Bad Request',
    },
  },
})
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

  @ApiOperation({ summary: 'Buy a player' })
  @UseGuards(AuthGuard('jwt'))
  @Post('buy')
  buyPlayer(@Body() dto: BuyPlayerDto, @Req() req: any) {
    return this.transfersService.buyPlayer(req.user.userId, dto.playerId);
  }

  @ApiOperation({ summary: 'Get market players with optional filters' })
  @Get()
  getMarket(@Query() filters: MarketFilterDto) {
    return this.transfersService.getMarketPlayers(filters);
  }

}
