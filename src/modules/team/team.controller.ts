import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamService } from './team.service';

import { ApiOkResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TeamWithPlayersResponseDto } from  './dto/team-with-players.response.dto';

@ApiTags('Team')
@ApiBearerAuth()
@Controller('team')
export class TeamController {
  constructor(private service: TeamService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    description: 'User team with players',
    type: TeamWithPlayersResponseDto,
  })
  @Get('me')
  getMyTeam(@Request() req: { user: { userId: number } }) {
    return this.service.getMyTeam(req.user.userId);
  }
}