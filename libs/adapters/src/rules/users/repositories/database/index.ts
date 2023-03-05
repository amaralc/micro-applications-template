import { InMemoryUsersDatabaseRepository } from '@core/domains/users/repositories/database-in-memory.repository';
import { featureFlags } from '@infra/config';
import { Logger } from '@nestjs/common';
import { MongooseMongodbUsersDatabaseRepository } from './mongoose-mongodb.repository';
import { PrismaPostgreSqlUsersDatabaseRepository } from './prisma-postgres.repository';

const className = 'UsersDatabaseRepositoryImplementation';

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
