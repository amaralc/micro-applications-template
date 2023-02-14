import { Logger } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { InMemoryUsersStorageRepository } from './in-memory-users-storage.repository';
import { PrismaUsersStorageRepository } from './prisma-users-storage.repository';

export abstract class UsersStorageRepository {
  abstract create(createUserDto: CreateUserDto): Promise<User>;
  abstract findAll(): Promise<Array<User>>;
}

const isPersistentStorageEnabled =
  process.env['PERSISTENT_STORAGE_ENABLED'] === 'true';

export const UsersStorageRepositoryImplementation = isPersistentStorageEnabled
  ? PrismaUsersStorageRepository
  : InMemoryUsersStorageRepository;

Logger.log(
  isPersistentStorageEnabled
    ? 'Using persistent storage...'
    : 'Using in memory storage...'
);
