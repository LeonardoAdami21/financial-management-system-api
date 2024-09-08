import { ApiProperty } from '@nestjs/swagger';

export class TransactionWithdrawDto {
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
