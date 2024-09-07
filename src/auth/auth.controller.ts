import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('')
@ApiTags('Authentication and Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'Error creating user' })
  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiCreatedResponse({ description: 'User login successfully' })
  @ApiBadRequestResponse({ description: 'Error logging in user' })
  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
