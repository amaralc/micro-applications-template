import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import { CreatePlanSubscriptionDto } from '../../dto/create-plan-subscription.dto';
import { PlanSubscription } from '../../entities/plan-subscription.entity';
import { InMemoryPlanSubscriptionsDatabaseRepository } from './implementation/in-memory.repository';
import { PrismaPlanSubscriptionsDatabaseRepository } from './implementation/prisma.repository';

// Abstraction
export abstract class PlanSubscriptionsDatabaseRepository {
  abstract create(
    createPlanSubscriptionDto: CreatePlanSubscriptionDto
  ): Promise<PlanSubscription>;
  abstract findAll(): Promise<Array<PlanSubscription>>;
  abstract findByEmail(email: string): Promise<PlanSubscription | null>;
}

// Implementation
const isInMemoryDatabaseEnabled =
  featureFlags.inMemoryDatabaseEnabled === 'true';
export const PlanSubscriptionsDatabaseRepositoryImplementation =
  isInMemoryDatabaseEnabled
    ? InMemoryPlanSubscriptionsDatabaseRepository
    : PrismaPlanSubscriptionsDatabaseRepository;

Logger.log(
  isInMemoryDatabaseEnabled
    ? 'Using in memory plan subscriptions database repository...'
    : 'Using persistent plan subscriptions database repository...'
);
