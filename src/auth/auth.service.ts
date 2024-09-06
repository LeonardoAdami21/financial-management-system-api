import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthRepositoryInterface } from './prisma/auth.repository.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { environmentVariables } from '../env/envoriment';
import { JwtStrategy } from '../guards/jwt.strategy';
import { enumRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    @Inject('auth__repository')
    private readonly authRepository: AuthRepositoryInterface,
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async register(dto: RegisterUserDto) {
    try {
      const {name, password, role } = dto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const passwordConfirmation = await bcrypt.hash(password, hashedPassword);
      const newUser = await this.authRepository.create({
        ...dto,
        name,
        password: passwordConfirmation,
        role: role || enumRole.USER,
      });
      if (passwordConfirmation !== hashedPassword) {
        throw new UnprocessableEntityException('Error hashing password');
      }
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const { email, password } = dto;
      const user = await this.authRepository.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ConflictException('Invalid password');
      }
      const payload = await this.jwtStrategy.validate({
        id: user.id,
        role: user.role,
      });
      const token = this.jwtService.sign(payload, {
        secret: environmentVariables.jwtSecret,
        expiresIn: '1d',
      });
      return { access_token: token };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
