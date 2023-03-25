// users.repository.ts
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { USERS_ERROR_MESSAGES } from '../constants/error-messages';
import { UserEntity } from '../entities/user/entity';
import { CreateUserDto } from '../services/create-user.dto';
import { UsersDatabaseRepository } from './database.repository';

const className = 'InMemoryUsersDatabaseRepository';

@Injectable()
export class InMemoryUsersDatabaseRepository implements UsersDatabaseRepository {
  private users: UserEntity[] = [];

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const isExistingUser = await this.findByEmail(email);
    if (isExistingUser) {
      throw new ConflictException(USERS_ERROR_MESSAGES['CONFLICTING_EMAIL']);
    }
    const user = new UserEntity({ email });
    this.users.push(user);
    Logger.log('UserEntity stored: ' + JSON.stringify(user), className);
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findAll() {
    return this.users;
  }
}
