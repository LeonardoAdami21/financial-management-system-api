import { ApiProperty } from '@nestjs/swagger';
import { userRole } from '@prisma/client';

export class RegisterUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    description: 'User Document(CPF or CNPJ)',
    example: '12345678901 or 12345678901234',
    type: String,
  })
  document: string;

  @ApiProperty({
    description: 'User email',
    example: 'p8iX7@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  password: string;

  role?: userRole;
}
