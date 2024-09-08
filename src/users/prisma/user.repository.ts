import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from './user.repository.interface';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(@Inject('dbClient') private readonly dbClient: PrismaClient) {}

  async findAll() {
    return await this.dbClient.users.findMany({
      include: {
        accounts: true,
      },
    });
  }
}
