import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AdminRepositoryInterface } from './admin.repository.interface';
import { RegisterAdminDto } from '../dto/register-admin.dto';

@Injectable()
export class AdminRepository implements AdminRepositoryInterface {
  constructor(@Inject('dbClient') private readonly dbClient: PrismaClient) {}

  private readonly authRepository = this.dbClient.users;

  async findAdminByEmail(email: string): Promise<any> {
    return await this.authRepository.findUnique({ where: { email } });
  }

  async findAdminByDocument(document: string): Promise<any> {
    return await this.authRepository.findUnique({ where: { document } });
  }

  async create(dto: RegisterAdminDto): Promise<any> {
    return await this.authRepository.create({ data: dto });
  }

  async findAll(): Promise<any> {
    return await this.authRepository.findMany();
  }

  async findAdminById(id: number): Promise<any> {
    return await this.authRepository.findUnique({ where: { id } });
  }

  async update(id: number, password: string): Promise<any> {
    return await this.authRepository.update({
      where: { id },
      data: { password },
    });
  }

  async userHistory(userId: number, action: string) {
    return await this.dbClient.usersHistory.create({
      data: {
        userId: userId,
        action: action,
      },
    });
  }

  async delete(id: number): Promise<any> {
    return await this.authRepository.delete({ where: { id } });
  }
}
