import { Transactions } from '@prisma/client';
import { TransactionWithdrawDto } from '../dto/transaction-widraw.dto';
import { TransactionDepositDto } from '../dto/transaction-deposit.dto';
import { TransactionTransferDto } from '../dto/transaction-transfer.dto';

export interface TransactionsRepositoryInterface {
  findAll(): Promise<Transactions[]>;
  withdraw(dto: TransactionWithdrawDto);
  deposit(dto: TransactionDepositDto);
  findByAccountId(accountId: number);
  transferance(dto: TransactionTransferDto);
  getAccountStatement(accountId: number, startDate: Date, endDate: Date);
  getAggregatedReport(startDate: Date, endDate: Date, type?: string);
}
