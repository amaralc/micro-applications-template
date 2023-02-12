import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.usersRepository.store(createUserDto);
    await this.usersRepository.publish(createUserDto);
    return `Hello, ${createUserDto.email}!`;
  }
}
