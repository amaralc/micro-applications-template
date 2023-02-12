// users.repository.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

interface CreatedUserMessage {
  key: 'email';
  value: string;
}

@Injectable()
export class UsersRepository {
  private usersCreatedTopic: CreatedUserMessage[] = [];
  private usersStorage: CreateUserDto[] = [];

  async store(createUserDto: CreateUserDto) {
    this.usersStorage.push(createUserDto);
    console.log('users', this.usersStorage);
  }

  async publish(createUserDto: CreateUserDto) {
    this.usersCreatedTopic.push({ key: 'email', value: createUserDto.email });
    console.log('users-created', this.usersCreatedTopic);
  }

  async findAll() {
    return this.usersStorage;
  }
}
