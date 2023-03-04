import { featureFlags } from '@core/config';
import { Logger } from '@nestjs/common';
import { InMemoryPlanSubscriptionsDatabaseRepository } from '../../../../../core/src/domains/plan-subscriptions/repositories/database-in-memory.repository';
import { MongooseMongoDbPlanSubscriptionsDatabaseRepository } from './implementation/mongoose-mongodb.repository';
import { PrismaPostgreSqlPlanSubscriptionsDatabaseRepository } from './implementation/prisma-postgresql.repository';

// Implementation
const getImplementation = () => {
  const isInMemoryDatabaseEnabled = featureFlags.inMemoryDatabaseEnabled === 'true';
  const useMongoDbInsteadOfPostgreSql = featureFlags.useMongoDbInsteadOfPostgreSql === 'true';

  if (isInMemoryDatabaseEnabled) {
    Logger.log('Using in memory plan subscriptions database repository...', PlanSubscriptionsDatabaseRepository.name);
    return InMemoryPlanSubscriptionsDatabaseRepository;
  }

  if (useMongoDbInsteadOfPostgreSql) {
    Logger.log(
      'Using in persistent plan subscriptions database repository with Mongoose and MongoDB...',
      PlanSubscriptionsDatabaseRepository.name
    );
    return MongooseMongoDbPlanSubscriptionsDatabaseRepository;
  }

  Logger.log(
    'Using in persistent plan subscriptions database repository with PrismaORM and PostgreSQL...',
    PlanSubscriptionsDatabaseRepository.name
  );
  return PrismaPostgreSqlPlanSubscriptionsDatabaseRepository;
};

export const PlanSubscriptionsDatabaseRepositoryImplementation = getImplementation();
