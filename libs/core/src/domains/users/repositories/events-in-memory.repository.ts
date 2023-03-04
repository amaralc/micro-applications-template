// users.repository.ts
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { USERS_TOPICS } from '../topics';
import { UsersEventsRepository } from './events.repository';

interface ISimplifiedProducerRecord {
  topic: string;
  messages: Array<{ key: string; value: string }>;
}

@Injectable()
export class InMemoryUsersEventsRepository implements UsersEventsRepository {
  private userCreatedTopicMessages: Array<ISimplifiedProducerRecord> = [];

  async publishUserCreated(user: UserEntity): Promise<void> {
    this.userCreatedTopicMessages.push({
      topic: USERS_TOPICS['USER_CREATED'],
      messages: [
        {
          key: user.email,
          value: JSON.stringify({
            email: user.email,
            id: user.id,
          }),
        },
      ],
    });
  }
}
