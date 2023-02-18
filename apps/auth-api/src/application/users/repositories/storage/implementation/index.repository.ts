import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../../config';
import { InMemoryUsersStorageRepository } from './in-memory-users-storage.repository';
import { PrismaUsersStorageRepository } from './prisma-users-storage.repository';

const isInMemoryStorageEnabled = featureFlags.inMemoryStorageEnabled === 'true';

export const UsersStorageRepositoryImplementation = isInMemoryStorageEnabled
  ? InMemoryUsersStorageRepository
  : PrismaUsersStorageRepository;

Logger.log(
  isInMemoryStorageEnabled
    ? 'Using in memory storage...'
    : 'Using persistent storage...'
);
