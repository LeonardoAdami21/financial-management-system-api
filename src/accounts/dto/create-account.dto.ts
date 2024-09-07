import { ApiProperty } from '@nestjs/swagger';
import { accountStatus } from '@prisma/client';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Balance',
    example: 1000,
  })
  balance: number;

  @ApiProperty({
    description: 'Status',
    enum: accountStatus,
    example: accountStatus.ACTIVE,
  })
  status: accountStatus;
}
