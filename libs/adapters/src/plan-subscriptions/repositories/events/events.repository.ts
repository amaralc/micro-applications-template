import { featureFlags } from '@infra/config';
import { Logger } from '@nestjs/common';
import { InMemoryPlanSubscriptionsEventsRepository } from './implementation/in-memory.repository';
import { KafkaPlanSubscriptionsEventsRepository } from './implementation/kafka.repository';

const className = 'PlanSubscriptionsEventsRepository';

// Implementation
const isInMemoryEventsEnabled = featureFlags.inMemoryEventsEnabled === 'true';
export const PlanSubscriptionsEventsRepositoryImplementation = isInMemoryEventsEnabled
  ? InMemoryPlanSubscriptionsEventsRepository
  : KafkaPlanSubscriptionsEventsRepository;

Logger.log(
  isInMemoryEventsEnabled
    ? 'Using in memory plan subscriptions events repository...'
    : 'Using persistent plan subscriptions events repository...',
  className
);
