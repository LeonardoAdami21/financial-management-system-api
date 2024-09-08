import { ApiProperty } from '@nestjs/swagger';

export class TransactionDepositDto {
  @ApiProperty({
    example: 1,
    description: 'Account id',
    type: Number,
  })
  accountId: number;

  @ApiProperty({
    example: 100,
    description: 'Amount',
    type: Number,
  })
  amount: number;
}
