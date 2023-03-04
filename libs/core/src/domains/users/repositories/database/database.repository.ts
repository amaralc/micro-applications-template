import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { InMemoryUsersDatabaseRepository } from './implementation/in-memory.repository';
import { MongooseMongodbUsersDatabaseRepository } from './implementation/mongoose-mongodb.repository';
import { PrismaPostgreSqlUsersDatabaseRepository } from './implementation/prisma-postgresql.repository';

const className = 'UsersDatabaseRepository';

// Abstraction
export abstract class UsersDatabaseRepository {
  abstract create(createUserDto: CreateUserDto): Promise<User>;
  abstract findAll(): Promise<Array<User>>;
  abstract findByEmail(email: string): Promise<User | null>;
}

// Implementation
const getImplementation = () => {
  const isInMemoryDatabaseEnabled = featureFlags.inMemoryDatabaseEnabled === 'true';
  const useMongoDbInsteadOfPostgreSql = featureFlags.useMongoDbInsteadOfPostgreSql === 'true';

  if (isInMemoryDatabaseEnabled) {
    Logger.log('Using in memory users database repository...', className);
    return InMemoryUsersDatabaseRepository;
  }

  if (useMongoDbInsteadOfPostgreSql) {
    Logger.log('Using in persistent users database repository with Mongoose and MongoDB...', className);
    return MongooseMongodbUsersDatabaseRepository;
  }

  Logger.log('Using in persistent users database repository with PrismaORM and PostgreSQL...', className);
  return PrismaPostgreSqlUsersDatabaseRepository;
};

export const UsersDatabaseRepositoryImplementation = getImplementation();
