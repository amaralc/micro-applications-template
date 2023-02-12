// users.repository.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  private users: CreateUserDto[] = [];

  async create(createUserDto: CreateUserDto) {
    this.users.push(createUserDto);
    console.log('users', this.users);
  }

  async findAll() {
    return this.users;
  }
}
