import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admin')
@ApiTags('Authentication and Authorization')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  register(@Body() dto: RegisterAdminDto) {
    return this.adminService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }
}
