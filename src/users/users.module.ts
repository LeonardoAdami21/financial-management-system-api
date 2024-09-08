import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './prisma/user.repository';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'users__repository',
      useClass: UserRepository,
    },
    {
      provide: 'dbClient',
      useValue: new PrismaClient(),
    },
  ],
})
export class UsersModule {}
