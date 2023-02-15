// users.repository.ts
import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { UsersEventsRepository } from './users-events.repository';

export interface IHeaders {
  [key: string]: Buffer | string | (Buffer | string)[] | undefined;
}

interface CreatedUserMessage {
  key: string;
  value: string;
  headers?: IHeaders;
}

@Injectable()
export class InMemoryUsersEventsRepository implements UsersEventsRepository {
  private usersCreatedTopic: CreatedUserMessage[] = [];

  async publishUserCreated(user: User): Promise<void> {
    this.usersCreatedTopic.push({
      key: user.email,
      value: JSON.stringify({
        id: user.id,
        email: user.email,
      }),
      headers: {
        role: 'default',
      },
    });
    console.log('user-created', this.usersCreatedTopic);
  }
}
