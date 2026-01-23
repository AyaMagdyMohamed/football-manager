import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MarketFilterDto {
  @IsOptional()
  @IsString()
  playerName?: string;

  @IsOptional()
  @IsString()
  teamName?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  
  minPrice?: number;

  @IsOptional()
@Type(() => Number) 
  @IsInt()
  @Min(0)
  maxPrice?: number;
}
