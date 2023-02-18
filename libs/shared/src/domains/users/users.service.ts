import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersDatabaseRepository } from './repositories/database/users-database.repository';
import { UsersEventsRepository } from './repositories/events/users-events.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersDatabaseRepository: UsersDatabaseRepository,
    private usersEventsRepository: UsersEventsRepository
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersDatabaseRepository.create(createUserDto);
      await this.usersEventsRepository.publishUserCreated(user);
      return user;
    } catch (e) {
      throw new ConflictException('This e-mail is already taken');
    }
  }
}
