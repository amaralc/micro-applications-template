import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../../config';
import { InMemoryUsersEventsRepository } from './in-memory-users-events.repository';
import { KafkaUsersEventsRepository } from './kafka-users-events.repository';

const isPersistentStorageEnabled =
  featureFlags.peristentStorageEnabled === 'true';

export const UsersEventsRepositoryImplementation = isPersistentStorageEnabled
  ? KafkaUsersEventsRepository
  : InMemoryUsersEventsRepository;

Logger.log(
  isPersistentStorageEnabled
    ? 'Using persistent events...'
    : 'Using in memory events...'
);
