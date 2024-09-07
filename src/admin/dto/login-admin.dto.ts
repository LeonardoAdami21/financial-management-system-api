import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    description: 'User email',
    example: 'p8iX7@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @IsNotEmpty()
  password: string;
}
