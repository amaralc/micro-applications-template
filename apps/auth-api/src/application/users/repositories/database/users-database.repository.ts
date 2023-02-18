import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { InMemoryUsersDatabaseRepository } from './implementation/in-memory-users-database.repository';
import { PrismaUsersDatabaseRepository } from './implementation/prisma-users-database.repository';

// Abstraction
export abstract class UsersDatabaseRepository {
  abstract create(createUserDto: CreateUserDto): Promise<User>;
  abstract findAll(): Promise<Array<User>>;
  abstract findByEmail(email: string): Promise<User | null>;
}

// Implementation
const isInMemoryStorageEnabled = featureFlags.inMemoryStorageEnabled === 'true';
export const UsersDatabaseRepositoryImplementation = isInMemoryStorageEnabled
  ? InMemoryUsersDatabaseRepository
  : PrismaUsersDatabaseRepository;

Logger.log(
  isInMemoryStorageEnabled
    ? 'Using in memory storage...'
    : 'Using persistent storage...'
);
