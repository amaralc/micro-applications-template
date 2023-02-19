import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../../config';
import { User } from '../../entities/user.entity';
import { InMemoryUsersEventsRepository } from './implementation/in-memory.repository';
import { KafkaUsersEventsRepository } from './implementation/kafka.repository';

// Abstraction
export abstract class UsersEventsRepository {
  abstract publishUserCreated(user: User): Promise<void>;
}

// Implementation
const isInMemoryEventsEnabled = featureFlags.inMemoryEventsEnabled === 'true';
export const UsersEventsRepositoryImplementation = isInMemoryEventsEnabled
  ? InMemoryUsersEventsRepository
  : KafkaUsersEventsRepository;

Logger.log(
  isInMemoryEventsEnabled
    ? 'Using in memory users events repository...'
    : 'Using persistent users events repository...'
);
