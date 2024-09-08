import { ApiProperty } from '@nestjs/swagger';

export class TransactionTransferDto {
  @ApiProperty({
    example: 1,
    description: 'From Account id',
    type: Number,
  })
  fromAccountId: number;

  @ApiProperty({
    example: 100,
    description: 'To Account id',
    type: Number,
  })
  toAccountId: number;

  @ApiProperty({
    example: 100,
    description: 'Amount',
    type: Number,
  })
  amount: number;
}
