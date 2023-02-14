import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEventsRepository } from './repositories/events/users-events.repository';
import { UsersStorageRepository } from './repositories/storage/users-storage.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersStorageRepository: UsersStorageRepository,
    private usersEventsRepository: UsersEventsRepository
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.usersStorageRepository.create(createUserDto);
    await this.usersEventsRepository.publishUserCreated(createUserDto);
    return `Hello, ${createUserDto.email}!`;
  }
}
