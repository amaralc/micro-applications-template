import { Injectable, Logger } from '@nestjs/common';
import { GlobalAppHttpException } from '../../errors/global-app-http-exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersDatabaseRepository } from './repositories/database/database.repository';
import { UsersEventsRepository } from './repositories/events/events.repository';

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
    } catch (error) {
      Logger.log(error);
      throw new GlobalAppHttpException(error);
    }
  }
}
