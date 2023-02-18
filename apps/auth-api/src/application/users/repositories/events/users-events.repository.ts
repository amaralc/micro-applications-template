import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import { User } from '../../entities/user.entity';
import { InMemoryUsersEventsRepository } from './implementation/in-memory-users-events.repository';
import { KafkaUsersEventsRepository } from './implementation/kafka-users-events.repository';

// Abstraction
export abstract class UsersEventsRepository {
  abstract publishUserCreated(user: User): Promise<void>;
}

// Implementation
const isInMemoryStorageEnabled = featureFlags.inMemoryStorageEnabled === 'true';
export const UsersEventsRepositoryImplementation = isInMemoryStorageEnabled
  ? InMemoryUsersEventsRepository
  : KafkaUsersEventsRepository;

Logger.log(
  isInMemoryStorageEnabled
    ? 'Using in memory events...'
    : 'Using persistent events...'
);
