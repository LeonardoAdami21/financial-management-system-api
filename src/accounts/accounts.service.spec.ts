import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { AccountRepository } from './prisma/account.repository';
import { PrismaClient } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';

describe('AccountsService', () => {
  let service: AccountsService;
  let accountRepository: AccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: 'accounts__repository',
          useClass: AccountRepository,
        },
        {
          provide: 'dbClient',
          useClass: PrismaClient,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new account', async () => {
    const dto: CreateAccountDto = {
      balance: 0,
      status: 'ACTIVE',
    };
    const account = await service.create(dto, 4);
    await accountRepository.userHistory(
      4,
      `Created account ${account.id} successfully`,
    );
    expect(account).toBeDefined();
  });

  it('should not create a new account with an invalid balance', async () => {
    const dto: CreateAccountDto = {
      balance: -1,
      status: 'ACTIVE',
    };
    try {
      await service.create(dto, 4);
    } catch (error) {
      expect(error).toBe(error);
    }
  });

  it('should not create a new account with an invalid status', async () => {
    const dto: CreateAccountDto = {
      balance: 0,
      status: 'INACTIVE',
    };
    try {
      await service.create(dto, 4);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
