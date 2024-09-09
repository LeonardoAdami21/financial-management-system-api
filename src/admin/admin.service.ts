import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../guards/jwt.strategy';
import { userRole } from '@prisma/client';
import { jwtSecret } from '../env/envoriment';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminRepository } from './prisma/admin.repository';

@Injectable()
export class AdminService {
  constructor(
    @Inject('admin__repository')
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async register(dto: RegisterAdminDto) {
    try {
      const { name, password, role, document } = dto;
      if (!name || !password || !document) {
        throw new BadRequestException('Missing required fields');
      }
      if (document.length < 11 || document.length > 14) {
        throw new BadRequestException('Invalid document');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const passwordConfirmation = await bcrypt.hash(password, hashedPassword);
      const newUser = await this.adminRepository.create({
        ...dto,
        name,
        password: passwordConfirmation,
        role: role || userRole.ADMIN,
      });
      if (passwordConfirmation !== hashedPassword) {
        throw new UnprocessableEntityException('Error hashing password');
      }
      await this.adminRepository.userHistory(
        newUser.id,
        `Admin ${newUser.name} created successfully`,
      );
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(dto: LoginAdminDto) {
    try {
      const { email, password } = dto;
      const admin = await this.adminRepository.findAdminByEmail(email);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw new ConflictException('Invalid password');
      }
      const payload = await this.jwtStrategy.validateAdmin({
        id: admin.id,
        role: admin.role,
      });
      const token = this.jwtService.sign(payload, {
        secret: jwtSecret,
        expiresIn: '1d',
      });
      await this.adminRepository.userHistory(
        admin.id,
        `Admin ${admin.name} logged in successfully`,
      );
      return { access_token: token };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
