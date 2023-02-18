import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import { PlanSubscription } from '../../entities/plan-subscription.entity';
import { InMemoryPlanSubscriptionsEventsRepository } from './implementation/in-memory.repository';
import { KafkaPlanSubscriptionsEventsRepository } from './implementation/kafka.repository';

// Abstraction
export abstract class PlanSubscriptionsEventsRepository {
  abstract consumePlanSubscriptionCreatedAndUpdateUsers(): Promise<void>;
  abstract publishPlanSubscriptionCreated(
    planSubscription: PlanSubscription
  ): Promise<void>;
}

// Implementation
const isInMemoryEventsEnabled = featureFlags.inMemoryEventsEnabled === 'true';
export const PlanSubscriptionsEventsRepositoryImplementation =
  isInMemoryEventsEnabled
    ? InMemoryPlanSubscriptionsEventsRepository
    : KafkaPlanSubscriptionsEventsRepository;

Logger.log(
  isInMemoryEventsEnabled
    ? 'Using in memory events...'
    : 'Using persistent events...'
);
