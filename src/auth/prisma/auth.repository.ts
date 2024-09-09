import { Inject, Injectable } from '@nestjs/common';
import { AuthRepositoryInterface } from './auth.repository.interface';
import { PrismaClient, userRole } from '@prisma/client';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class AuthRepository implements AuthRepositoryInterface {
  constructor(@Inject('dbClient') private readonly dbClient: PrismaClient) {}

  private readonly authRepository = this.dbClient.users;

  async findUserByEmail(email: string): Promise<any> {
    return await this.authRepository.findUnique({
      where: {
        email: email,
      },
    });
  }
  async create(dto: RegisterUserDto) {
    const user = await this.authRepository.create({
      data: dto,
    });
    await this.userHistory(user.id, `User ${user.name} created successfully`);
    return user
  }

  async userHistory(userId: number, action: string) {
    return await this.dbClient.usersHistory.create({
      data: {
        userId: userId,
        action: action,
      },
    });
  }

  async findAll() {
    return await this.authRepository.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
  async findByDocument(document: string): Promise<any> {
    return await this.authRepository.findUnique({
      where: {
        document: document,
      },
    });
  }
  findUserById(id: number): Promise<any> {
    throw new Error('Method not implemented.');
  }
  update(id: number, password: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
