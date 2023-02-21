import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import {
  EachMessageHandler,
  EachMessagePayload,
} from '../../../../infra/events/types';
import { PlanSubscription } from '../../entities/plan-subscription.entity';
import { InMemoryPlanSubscriptionsEventsRepository } from './implementation/in-memory.repository';
import { KafkaPlanSubscriptionsEventsRepository } from './implementation/kafka.repository';

const className = 'PlanSubscriptionsEventsRepository';

// Abstraction
export abstract class PlanSubscriptionsEventsRepository {
  abstract consumePlanSubscriptionCreated(
    callback: EachMessageHandler
  ): Promise<void>;
  abstract createUserFromPlanSubscriptionCreated(
    payload: EachMessagePayload
  ): Promise<void>;
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
    ? 'Using in memory plan subscriptions events repository...'
    : 'Using persistent plan subscriptions events repository...',
  className
);
