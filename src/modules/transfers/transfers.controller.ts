import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { SellPlayerDto } from './dto/sell-player.dto';
import { AuthGuard } from '@nestjs/passport';

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
}
