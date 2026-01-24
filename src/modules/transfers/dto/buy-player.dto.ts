import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyPlayerDto {
  
  @ApiProperty({ example: 12 })
  @IsInt()
  playerId: number;
}
