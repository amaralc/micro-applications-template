import { ListPaginatedPlanSubscriptionsDto } from '@adapters/plan-subscriptions/list-paginated-plan-subscriptions.dto';
import { Logger } from '@nestjs/common';
import { CreatePlanSubscriptionDto } from '../../../../../../adapters/src/plan-subscriptions/create-plan-subscription.dto';
import { featureFlags } from '../../../../config';
import { PlanSubscription } from '../../entities/plan-subscription.entity';
import { PlanSubscriptionEntity } from '../../entities/plan-subscription/entity';
import { InMemoryPlanSubscriptionsDatabaseRepository } from './implementation/in-memory.repository';
import { MongooseMongoDbPlanSubscriptionsDatabaseRepository } from './implementation/mongoose-mongodb.repository';
import { PrismaPostgreSqlPlanSubscriptionsDatabaseRepository } from './implementation/prisma-postgresql.repository';

// Abstraction
export abstract class PlanSubscriptionsDatabaseRepository {
  abstract create(createPlanSubscriptionDto: CreatePlanSubscriptionDto): Promise<PlanSubscription>;
  abstract listPaginated(
    listPaginatedPlanSubscriptionsDto: ListPaginatedPlanSubscriptionsDto
  ): Promise<Array<PlanSubscriptionEntity>>;
  abstract findByEmail(email: string): Promise<PlanSubscription | null>;
}

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
