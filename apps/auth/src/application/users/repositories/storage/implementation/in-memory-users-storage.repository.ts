// users.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { User } from '../../../entities/user.entity';
import { UsersStorageRepository } from '../users-storage.repository';

@Injectable()
export class InMemoryUsersStorageRepository implements UsersStorageRepository {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const isExistingUser = await this.findByEmail(email);
    if (isExistingUser) {
      throw new ConflictException('This e-mail is already taken');
    }
    const user = new User(email);
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findAll() {
    return this.users;
  }
}
