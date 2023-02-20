import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUser } from './services/create-user';

@Injectable()
export class UsersService {
  constructor(private createUser: CreateUser) {}

  create(createUserDto: CreateUserDto) {
    return this.createUser.execute(createUserDto);
  }
}
