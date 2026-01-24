import { ApiProperty } from '@nestjs/swagger';

export class TeamInfoDto {
  @ApiProperty({ example: 7 })
  id: number;

  @ApiProperty({ example: 5000000 })
  budget: number;

  @ApiProperty({ example: 'READY' })
  status: string;
  @ApiProperty({ example: 'FC Awesome' })
  name: string;
}
