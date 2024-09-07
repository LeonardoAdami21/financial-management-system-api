import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AccountRepositoryInterface } from './prisma/account.repository.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @Inject('accounts__repository')
    private readonly accountsRepository: AccountRepositoryInterface,
  ) {}

  async findAll() {
    try {
      const accounts = await this.accountsRepository.findAll();
      return accounts;
    } catch (error) {
      throw new InternalServerErrorException('Error finding accounts');
    }
  }

  async create(dto: CreateAccountDto, userId: number) {
    try {
      const user = await this.accountsRepository.findAdminById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const account = await this.accountsRepository.create(dto, user.id);
      return account;
    } catch (error) {
      throw new BadRequestException('Error creating account');
    }
  }

  async getAccountBalance(id: number) {
    try {
      const account = await this.accountsRepository.findById(id);
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      return {balance: account.balance};
    } catch (error) {
      throw new InternalServerErrorException('Error finding account');
    }
  }

  async update(
    id: number,
    dto: UpdateAccountDto,
    userId: number,
  ){
    try {
      const user = await this.accountsRepository.findAdminById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.accountsRepository.toggleActiveAccountStatus(id, dto, user.id);
      return { message: 'Account updated successfully' };
    } catch (error) {
      throw new BadRequestException('Error updating account');
    }
  }

  async delete(id: number, userId: number): Promise<any> {
    try {
      const user = await this.accountsRepository.findAdminById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.accountsRepository.delete(id, user.id);
      return { message: 'Account deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting account');
    }
  }
}
