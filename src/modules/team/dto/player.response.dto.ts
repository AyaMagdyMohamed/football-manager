import { ApiProperty } from '@nestjs/swagger';

export class PlayerInfoDto {
  @ApiProperty({ example: 121 })
  id: number;

  @ApiProperty({ example: 'GK_1_Leo Silva' })
  name: string;

  @ApiProperty({ example: 'GK' })
  position: string;

  @ApiProperty({ example: false })
  isForSale: boolean;
}
