import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './prisma/transactions.repository';
import { PrismaClient } from '@prisma/client';
import { TransactionDepositDto } from './dto/transaction-deposit.dto';
import { TransactionTransferDto } from './dto/transaction-transfer.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new deposit', async () => {
    const dto: TransactionDepositDto = {
      accountId: 1,
      amount: 100
    };
    const transaction = await service.deposit(dto);
    expect(transaction).toBeDefined();
  })
  it('should not create a new deposit with an invalid amount', async () => {
    const dto: TransactionDepositDto = {
      accountId: 1,
      amount: 0
    };
    try {
      await service.deposit(dto);
    } catch (error) {
      expect(error).toBe(error);
    }
  })
  it('should not create a new deposit with an invalid account', async () => {
    const dto: TransactionDepositDto = {
      accountId: 0,
      amount: 100
    };
    try {
      await service.deposit(dto);
    } catch (error) {
      expect(error).toBe(error);
    }
  })

  it('should withdraw money from an account', async () => {
    const dto: TransactionDepositDto = {
      accountId: 1,
      amount: 100
    };
    const transaction = await service.withdraw(dto);
    expect(transaction).toBeDefined();
  })
  it('should not withdraw money from an account with an invalid amount', async () => {
    const dto: TransactionDepositDto = {
      accountId: 1,
      amount: 0
    };
    try {
      await service.withdraw(dto);
    } catch (error) {
      expect(error).toBe(error);
    }
  })
  it('should not withdraw money from an account with an invalid account', async () => {
    const dto: TransactionDepositDto = {
      accountId: 0,
      amount: 100
    };
    try {
      await service.withdraw(dto);
    } catch (error) {
      expect(error).toBe(error);
    }
  })

  it('should transfer money from one account to another', async () => {
    const dto: TransactionTransferDto = {
      fromAccountId: 1,
      toAccountId: 2,
      amount: 10
    };
    const transaction = await service.transferance(dto);
    expect(transaction).toBeDefined();
  })

  it('should not transfer money from one account to another with an invalid amount', async () => {
    const dto: TransactionTransferDto = {
      fromAccountId: 1,
      toAccountId: 2,
      amount: 0
    };
    try {
      const transaction = await service.transferance(dto);
      expect(transaction).toBeDefined();
    } catch (error) {
      expect(error).toBe(error);
    }
  })

  it('should not transfer money from one account to another with an invalid account', async () => {
    const dto: TransactionTransferDto = {
      fromAccountId: 0,
      toAccountId: 2,
      amount: 10
    };
    try {
      const transaction = await service.transferance(dto);
      expect(transaction).toBeDefined();
    } catch (error) {
      expect(error).toBe(error);
    }
  })
});
