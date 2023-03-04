import { InMemoryUsersEventsRepository } from '@core/domains/users/repositories/events-in-memory.repository';
import { featureFlags } from '@infra/config';
import { Logger } from '@nestjs/common';
import { KafkaUsersEventsRepository } from './kafka.repository';

const className = 'UsersEventsRepository';

// Implementation
const isInMemoryEventsEnabled = featureFlags.inMemoryEventsEnabled === 'true';
export const UsersEventsRepositoryImplementation = isInMemoryEventsEnabled
  ? InMemoryUsersEventsRepository
  : KafkaUsersEventsRepository;

Logger.log(
  isInMemoryEventsEnabled
    ? 'Using in memory users events repository...'
    : 'Using persistent users events repository...',
  className
);
