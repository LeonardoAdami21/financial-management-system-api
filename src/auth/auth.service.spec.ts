import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './prisma/auth.repository';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../guards/jwt.strategy';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        JwtStrategy,
        {
          provide: 'auth__repository',
          useClass: AuthRepository,
        },
        {
          provide: 'dbClient',
          useClass: PrismaClient,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const dto: RegisterUserDto = {
      name: 'John Doe',
      document: '12345678901',
      email: 'bJ5jI@example.com',
      password: '123456',
      role: 'USER',
    };
    await authRepository.create(dto);
    const user = await service.register(dto);
    await authRepository.userHistory(
      user.id,
      `User ${user.name} created successfully`,
    );
    expect(user).toBeDefined();
  });

  it('should not create a new user with an existing email', async () => {
    try {
      const dto: RegisterUserDto = {
        name: 'John Doe',
        document: '12345678901',
        email: 'bJ5jI@example.com',
        password: '123456',
        role: 'USER',
      };
      await authRepository.create(dto);
      const user = await service.register(dto);
      expect(user).toBeDefined();
    } catch (error) {
      expect(error).toBe(error);
    }
  });
  it('should not create a new user with an invalid document', async () => {
    try {
      const dto: RegisterUserDto = {
        name: 'John Doe',
        document: '1234567890',
        email: 'bJ5jI@example.com',
        password: '123456',
        role: 'USER',
      };
      await service.register(dto);
    } catch (error) {
      expect(error).toBe(error);
    }
  });

  it('should login a user', async () => {
    const dto: LoginUserDto = {
      email: 'bJ5jI@example.com',
      password: '123456',
    };
    const user = await authRepository.findUserByEmail(dto.email);
    const token = await service.login(dto);
    await authRepository.userHistory(
      user.id,
      `User ${user.name} logged in successfully`,
    );
    expect({ access_token: token }).toBeDefined();
  });

  it('should not login a user with an invalid email', async () => {
    try {
      const dto: LoginUserDto = {
        email: 'bJ5jI@example.com',
        password: '123456',
      };
      await service.login(dto);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
  it('should not login a user with an invalid password', async () => {
    try {
      const dto: LoginUserDto = {
        email: 'bJ5jI@example.com',
        password: '1234567',
      };
      await service.login(dto);
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
