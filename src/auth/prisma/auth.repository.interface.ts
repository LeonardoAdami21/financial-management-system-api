import { RegisterUserDto } from '../dto/register-user.dto';

export interface AuthRepositoryInterface {
  findUserByEmail(email: string): Promise<any>;
  create(dto: RegisterUserDto): Promise<any>;
  findAll(): Promise<any>;
  findUserById(id: number): Promise<any>;
  update(id: number, password: string): Promise<any>;
  delete(id: number): Promise<any>;
}
