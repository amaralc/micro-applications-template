import { InMemoryPlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database-in-memory.repository';
import { PlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database.repository';
import { featureFlags } from '@infra/config';
import { Logger } from '@nestjs/common';
import { MongooseMongoDbPlanSubscriptionsDatabaseRepository } from './mongoose-mongodb.repository';
import { PrismaPostgreSqlPlanSubscriptionsDatabaseRepository } from './prisma-postgresql.repository';

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
