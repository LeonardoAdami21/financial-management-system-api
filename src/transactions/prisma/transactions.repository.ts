import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsRepositoryInterface } from './transactions.repository.interface';
import { PrismaClient, Transactions } from '@prisma/client';
import { TransactionWithdrawDto } from '../dto/transaction-widraw.dto';
import { TransactionDepositDto } from '../dto/transaction-deposit.dto';
import { TransactionTransferDto } from '../dto/transaction-transfer.dto';

@Injectable()
export class TransactionsRepository implements TransactionsRepositoryInterface {
  constructor(@Inject('dbClient') private readonly dbClient: PrismaClient) {}

  async findAll() {
    return await this.dbClient.transactions.findMany({});
  }
  async withdraw(dto: TransactionWithdrawDto) {
    try {
      const { accountId, amount } = dto;
      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }
      const account = await this.dbClient.accounts.findUnique({
        where: {
          id: accountId,
        },
      });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      if (account.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }
      const updatedAccount = await this.dbClient.accounts.update({
        where: {
          id: accountId,
        },
        data: {
          balance: account.balance - amount,
        },
      });
      const transaction = await this.dbClient.transactions.create({
        data: {
          type: 'WITHDRAWAL',
          status: 'COMPLETED',
          amount,
          accountId: updatedAccount.id,
        },
      });
      return {
        updatedAccount,
        transaction,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async deposit(dto: TransactionDepositDto) {
    try {
      const { accountId, amount } = dto;
      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }
      const account = await this.dbClient.accounts.findUnique({
        where: {
          id: accountId,
        },
      });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      const updatedAccount = await this.dbClient.accounts.update({
        where: {
          id: accountId,
        },
        data: {
          balance: account.balance + amount,
        },
      });
      const transaction = await this.dbClient.transactions.create({
        data: {
          type: 'DEPOSIT',
          status: 'COMPLETED',
          amount,
          accountId: accountId,
        },
      });
      return { updatedAccount, transaction };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async transferance(dto: TransactionTransferDto) {
    try {
      const { fromAccountId, toAccountId, amount } = dto;
      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }
      const fromAccount = await this.dbClient.accounts.findUnique({
        where: { id: fromAccountId },
      });
      const toAccount = await this.dbClient.accounts.findUnique({
        where: { id: toAccountId },
      });
      if (!fromAccount) {
        throw new NotFoundException('From account not found');
      }
      if (!toAccount) {
        throw new NotFoundException('To account not found');
      }
      if (fromAccount.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }
      const updatedFromAccount = await this.dbClient.accounts.update({
        where: {
          id: fromAccountId,
        },
        data: {
          balance: fromAccount.balance - amount,
        },
      });
      const updatedToAccount = await this.dbClient.accounts.update({
        where: {
          id: toAccountId,
        },
        data: {
          balance: toAccount.balance + amount,
        },
      });
      const transaction = await this.dbClient.transactions.create({
        data: {
          type: 'TRANSFER',
          status: 'COMPLETED',
          accountId: fromAccount.id,
          amount,
        },
      });
      return {
        updatedFromAccount,
        updatedToAccount,
        transaction,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByAccountId(accountId: number) {
    const account = await this.dbClient.accounts.findUnique({
      where: {
        id: accountId,
      },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async getAccountStatement(accountId: number, startDate: Date, endDate: Date) {
    const account = await this.dbClient.accounts.findUnique({
      where: {
        id: accountId,
      },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    const transactions = await this.dbClient.transactions.findMany({
      where: {
        accountId: accountId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return {
      accountId: accountId,
      balance: account.balance,
      transactions,
    };
  }

  async getAggregatedReport(startDate: Date, endDate: Date, type?: string) {
    const filter: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      type: type
    };
    if (type) {
      filter.type = type;
    }
    const transactions = await this.dbClient.transactions.findMany({
      where: filter,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        account: true,
      },
    });
    return transactions;
  }
}
