import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../guards/jwt.strategy';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './prisma/admin.repository';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtService,
    JwtStrategy,
    {
      provide: 'dbClient',
      useClass: PrismaClient,
    },
    {
      provide: 'admin__repository',
      useClass: AdminRepository,
    },
    {
      provide: JwtService,
      useFactory: () => new JwtService(),
    },
  ],
})
export class AdminModule {}
