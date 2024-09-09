import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsRepository } from './prisma/transactions.repository';
import { TransactionWithdrawDto } from './dto/transaction-widraw.dto';
import { TransactionDepositDto } from './dto/transaction-deposit.dto';
import { TransactionTransferDto } from './dto/transaction-transfer.dto';
import { TransactionsRepositoryInterface } from './prisma/transactions.repository.interface';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('transactions__repository')
    private readonly transactionsRepository: TransactionsRepositoryInterface,
  ) {}

  async findAll() {
    try {
      const transactions = await this.transactionsRepository.findAll();
      return transactions;
    } catch (error) {
      throw new InternalServerErrorException('Error finding transactions');
    }
  }

  async withdraw(dto: TransactionWithdrawDto) {
    try {
      const { accountId, amount } = dto;
      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }
      const account =
        await this.transactionsRepository.findByAccountId(+accountId);
      if (!account) {
        throw new NotFoundException('Account not found');
      }

      const transaction = await this.transactionsRepository.withdraw({
        accountId,
        amount,
      });
      await this.transactionsRepository.userHistory(
        account.userId,
        `Withdrew ${amount} from account ${account.id}`,
      );
      return transaction;
    } catch (error) {
      throw new InternalServerErrorException('Error withdrawing');
    }
  }

  async deposit(dto: TransactionDepositDto) {
    try {
      const { accountId, amount } = dto;
      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }
      const account =
        await this.transactionsRepository.findByAccountId(accountId);
      if (!account) {
        throw new NotFoundException('Account not found');
      }

      const transaction = await this.transactionsRepository.deposit({
        accountId,
        amount,
      });
      await this.transactionsRepository.userHistory(
        account.userId,
        `Deposited ${amount} to account ${account.id}`,
      );
      return transaction;
    } catch (error) {
      throw new InternalServerErrorException('Error depositing amount');
    }
  }

  async transferance(dto: TransactionTransferDto) {
    try {
      const { fromAccountId, toAccountId, amount } = dto;
      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }
      const fromAccount =
        await this.transactionsRepository.findByAccountId(fromAccountId);
      if (!fromAccount) {
        throw new NotFoundException('From account not found');
      }
      const toAccount =
        await this.transactionsRepository.findByAccountId(toAccountId);
      if (!toAccount) {
        throw new NotFoundException('To account not found');
      }
      const transaction = await this.transactionsRepository.transferance({
        fromAccountId,
        toAccountId,
        amount,
      });
      await this.transactionsRepository.userHistory(
        fromAccount.userId,
        `Transferred ${amount} from account ${fromAccount.id} to account ${toAccount.id}`,
      );
      await this.transactionsRepository.userHistory(
        toAccount.userId,
        `Received ${amount} from account ${fromAccount.id} to account ${toAccount.id}`,
      );
      return transaction;
    } catch (error) {
      throw new InternalServerErrorException('Error transfering amount');
    }
  }

  async getAccountStatement(accountId: number, startDate: Date, endDate: Date) {
    try {
      const formatedAccountId = Number(accountId);
      const transactions =
        await this.transactionsRepository.getAccountStatement(
          +formatedAccountId,
          startDate,
          endDate,
        );
      return transactions;
    } catch (error) {
      throw new InternalServerErrorException('Error getting account statement');
    }
  }

  async getAggregatedReport(startDate: Date, endDate: Date, type?: string) {
    try {
      const transactions =
        await this.transactionsRepository.getAggregatedReport(
          startDate,
          endDate,
          type,
        );
      return transactions;
    } catch (error) {
      throw new InternalServerErrorException('Error getting aggregated report');
    }
  }
}
