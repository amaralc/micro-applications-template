import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../../../libs/shared/src/domains/users/dto/create-user.dto';
import { UsersDatabaseRepository } from '../../../../../libs/shared/src/domains/users/repositories/database/users-database.repository';
import { UsersEventsRepository } from '../../../../../libs/shared/src/domains/users/repositories/events/users-events.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersDatabaseRepository: UsersDatabaseRepository,
    private usersEventsRepository: UsersEventsRepository
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersDatabaseRepository.create(createUserDto);
    await this.usersEventsRepository.publishUserCreated(user);
    return `Hello, ${createUserDto.email}!`;
  }
}
