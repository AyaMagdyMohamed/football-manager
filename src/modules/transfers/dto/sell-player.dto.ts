import { IsInt, Min } from 'class-validator';

export class SellPlayerDto {
  @IsInt()
  playerId: number;

  @IsInt()
  @Min(1)
  askingPrice: number;
}