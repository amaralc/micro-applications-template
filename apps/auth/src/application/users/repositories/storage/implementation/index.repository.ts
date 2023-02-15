import { Logger } from '@nestjs/common';
import { InMemoryUsersStorageRepository } from './in-memory-users-storage.repository';
import { PrismaUsersStorageRepository } from './prisma-users-storage.repository';

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
