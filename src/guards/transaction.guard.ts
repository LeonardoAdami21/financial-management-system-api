import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class TransactionGuard implements CanActivate {
  private readonly transactionLimit = 5;
  private readonly transactionPeriod = 60 * 1000;
  constructor(
    @Inject('dbClient') private readonly dbClient: PrismaClient,
    private readonly reflection: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { accountId, amount } = request.body;
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    const account = await this.dbClient.accounts.findFirst({
      where: {
        id: accountId,
      },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - this.transactionPeriod);

    const transactions = await this.dbClient.transactions.count({
      where: {
        accountId: account.id,
        createdAt: {
          gte: oneMinuteAgo,
        },
      },
    });
    if (transactions >= this.transactionLimit) {
      throw new BadRequestException(
        `Transaction limit ${this.transactionLimit} reached`,
      );
    }
    return true;
  }
}
