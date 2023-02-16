// users.repository.ts
import { Injectable } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { USERS_TOPICS } from '../constants';
import { IUserCreatedMessagePayload } from '../types';
import { UsersEventsRepository } from '../users-events.repository';

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
    const messagePayload: IUserCreatedMessagePayload = {
      email: user.email,
      id: user.id,
    };

    this.usersCreatedTopic.push({
      key: user.email,
      value: JSON.stringify(messagePayload),
    });

    console.log(USERS_TOPICS['USER_CREATED'], this.usersCreatedTopic);
  }
}
