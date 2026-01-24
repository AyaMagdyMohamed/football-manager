import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MarketFilterDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  playerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  
  minPrice?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number) 
  @IsInt()
  @Min(0)
  maxPrice?: number;
}
