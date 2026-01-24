import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SellPlayerDto {
  @IsInt()
  @ApiProperty({ example: 12 })
  playerId: number;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1000000 })
  askingPrice: number;
}