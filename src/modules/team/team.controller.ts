import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private service: TeamService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyTeam(@Request() req: { user: { userId: number } }) {
    return this.service.getMyTeam(req.user.userId);
  }
}