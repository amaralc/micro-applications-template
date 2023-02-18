// users.repository.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { User } from '../../../entities/user.entity';
import { UsersDatabaseRepository } from '../users-database.repository';

@Injectable()
export class InMemoryUsersDatabaseRepository
  implements UsersDatabaseRepository
{
  private users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const isExistingUser = await this.findByEmail(email);
    if (isExistingUser) {
      throw new Error('conflict_existing_user');
    }
    const user = new User(email);
    this.users.push(user);
    console.log('user stored', this.users);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findAll() {
    return this.users;
  }
}
