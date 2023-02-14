import { Logger } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { InMemoryUsersRepository } from './in-memory-users.repository';
import { PrismaUsersRepository } from './prisma-users.repository';

export abstract class UsersRepository {
  abstract create(createUserDto: CreateUserDto): Promise<User>;
  abstract findAll(): Promise<Array<User>>;
}

const isPersistentStorageEnabled =
  process.env['PERSISTENT_STORAGE_ENABLED'] === 'true';

export const UsersRepositoryImplementation = isPersistentStorageEnabled
  ? PrismaUsersRepository
  : InMemoryUsersRepository;

Logger.log(
  isPersistentStorageEnabled
    ? 'Using persistant storage...'
    : 'Using in memory storage...'
);
