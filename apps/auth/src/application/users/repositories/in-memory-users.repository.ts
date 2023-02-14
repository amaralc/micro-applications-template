// users.repository.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UsersRepository } from './users.repository';

// interface CreatedUserMessage {
//   key: 'email';
//   value: string;
// }

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  // private usersCreatedTopic: CreatedUserMessage[] = [];
  private users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto.email);
    this.users.push(user);
    console.log('users', this.users);
    return user;
  }

  // async publish(createUserDto: CreateUserDto) {
  //   this.usersCreatedTopic.push({ key: 'email', value: createUserDto.email });
  //   console.log('users-created', this.usersCreatedTopic);
  // }

  async findAll() {
    return this.users;
  }
}
