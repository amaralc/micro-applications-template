import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../../config';
import { InMemoryUsersEventsRepository } from './in-memory-users-events.repository';
import { KafkaUsersEventsRepository } from './kafka-users-events.repository';

const isInMemoryStorageEnabled = featureFlags.inMemoryStorageEnabled === 'true';

export const UsersEventsRepositoryImplementation = isInMemoryStorageEnabled
  ? InMemoryUsersEventsRepository
  : KafkaUsersEventsRepository;

Logger.log(
  isInMemoryStorageEnabled
    ? 'Using in memory events...'
    : 'Using persistent events...'
);
