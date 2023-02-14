import { Logger } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { InMemoryUsersEventsRepository } from './in-memory-users-events.repository';
import { KafkaUsersEventsRepository } from './kafka-users-events.repository';

export abstract class UsersEventsRepository {
  abstract publishUserCreated(createUserDto: CreateUserDto): Promise<void>;
}

const isPersistentStorageEnabled =
  process.env['PERSISTENT_STORAGE_ENABLED'] === 'true';

export const UsersEventsRepositoryImplementation = isPersistentStorageEnabled
  ? KafkaUsersEventsRepository
  : InMemoryUsersEventsRepository;

Logger.log(
  isPersistentStorageEnabled
    ? 'Using persistent events...'
    : 'Using in memory events...'
);
