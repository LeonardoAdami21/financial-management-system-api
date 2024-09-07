import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaClient } from '@prisma/client';
import { AccountRepository } from './prisma/account.repository';

@Module({
  controllers: [AccountsController],
  providers: [
    AccountsService,
    {
      provide: 'dbClient',
      useClass: PrismaClient,
    },
    {
      provide: 'accounts__repository',
      useClass: AccountRepository,
    },
  ],
})
export class AccountsModule {}
