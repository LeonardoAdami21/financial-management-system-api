import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepositoryInterface } from './account.repository.interface';
import { PrismaClient } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';

@Injectable()
export class AccountRepository implements AccountRepositoryInterface {
  constructor(@Inject('dbClient') private readonly dbClient: PrismaClient) {}
  async create(dto: CreateAccountDto, userId: number) {
    const newAccount = await this.dbClient.accounts.create({
      data: {
        ...dto,
        userId,
      },
    });
    return newAccount;
  }
  async findAll() {
    return await this.dbClient.accounts.findMany();
  }
  async findById(id: number) {
    return await this.dbClient.accounts.findUnique({ where: { id } });
  }
  async findAdminById(userId: number) {
    const user = await this.dbClient.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async toggleActiveAccountStatus(
    id: number,
    dto: UpdateAccountDto,
    userId: number,
  ) {
    const user = await this.dbClient.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedAccount = await this.dbClient.accounts.update({
      where: { id },
      data: { status: dto.status },
    });
    return updatedAccount;
  }
  async delete(id: number, userId: number) {
    const user = await this.dbClient.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.dbClient.accounts.delete({ where: { id } });
  }
}
