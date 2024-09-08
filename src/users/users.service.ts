import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepositoryInterface } from './prisma/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('users__repository')
    private readonly usersRepository: UserRepositoryInterface,
  ) {}

  async findAll() {
    try {
      const users = await this.usersRepository.findAll();
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Error finding users');
    }
  }
}
