import { Accounts } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';

export interface AccountRepositoryInterface {
  create(dto: CreateAccountDto, userId: number): Promise<Accounts>;
  findAll(): Promise<Accounts[]>;
  findById(id: number);
  findAdminById(userId: number);
  toggleActiveAccountStatus(id: number, dto: UpdateAccountDto, userId: number);
  delete(id: number, userId: number);
}
