// users.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { User } from '../../../entities/user.entity';
import { USERS_ERROR_MESSAGES } from '../../../errors/error-messages';
import { UsersDatabaseRepository } from '../database.repository';

@Injectable()
export class InMemoryUsersDatabaseRepository
  implements UsersDatabaseRepository
{
  private users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const isExistingUser = await this.findByEmail(email);
    if (isExistingUser) {
      throw new ConflictException(
        USERS_ERROR_MESSAGES['CONFLICT_EMAIL_ALREADY_EXIST']
      );
    }
    const user = new User(email);
    this.users.push(user);
    console.log('User stored: ', user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findAll() {
    return this.users;
  }
}
