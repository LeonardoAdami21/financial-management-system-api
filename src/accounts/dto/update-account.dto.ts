import { ApiProperty } from '@nestjs/swagger';
import { accountStatus } from '@prisma/client';

export class UpdateAccountDto {
  @ApiProperty({
    description: 'Status of the account',
    enum: accountStatus,
    example: accountStatus.ACTIVE || accountStatus.INACTIVE,
  })
  status: accountStatus;
}
