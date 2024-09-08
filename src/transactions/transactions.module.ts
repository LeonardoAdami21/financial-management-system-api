import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './prisma/transactions.repository';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    {
      provide: 'transactions__repository',
      useClass: TransactionsRepository,
    },
    {
      provide: 'dbClient',
      useClass: PrismaClient,
    },
  ],
})
export class TransactionsModule {}
