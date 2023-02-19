import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { InMemoryUsersDatabaseRepository } from './implementation/in-memory.repository';
import { PrismaUsersDatabaseRepository } from './implementation/prisma.repository';

// Abstraction
export abstract class UsersDatabaseRepository {
  abstract create(createUserDto: CreateUserDto): Promise<User>;
  abstract findAll(): Promise<Array<User>>;
  abstract findByEmail(email: string): Promise<User | null>;
}

// Implementation
const isInMemoryDatabaseEnabled =
  featureFlags.inMemoryDatabaseEnabled === 'true';
export const UsersDatabaseRepositoryImplementation = isInMemoryDatabaseEnabled
  ? InMemoryUsersDatabaseRepository
  : PrismaUsersDatabaseRepository;

Logger.log(
  isInMemoryDatabaseEnabled
    ? 'Using in memory users database repository...'
    : 'Using persistent users database repository...'
);
