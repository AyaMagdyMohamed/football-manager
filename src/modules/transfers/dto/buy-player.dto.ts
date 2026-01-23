import { IsInt } from 'class-validator';

export class BuyPlayerDto {
  @IsInt()
  playerId: number;
}
