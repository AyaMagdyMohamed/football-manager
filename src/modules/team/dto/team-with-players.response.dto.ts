import { ApiProperty } from '@nestjs/swagger';
import { TeamInfoDto } from './team.response.dto';
import { PlayerInfoDto } from './player.response.dto';

export class TeamWithPlayersResponseDto {
  @ApiProperty({ type: TeamInfoDto })
  team: TeamInfoDto;

  @ApiProperty({ type: [PlayerInfoDto] })
  players: PlayerInfoDto[];
}
