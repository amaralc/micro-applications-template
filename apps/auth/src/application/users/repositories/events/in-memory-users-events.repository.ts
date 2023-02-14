// users.repository.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UsersEventsRepository } from './users-events.repository';

export interface IHeaders {
  [key: string]: Buffer | string | (Buffer | string)[] | undefined;
}

interface CreatedUserMessage {
  key: 'email';
  value: string;
  headers?: IHeaders;
}

@Injectable()
export class InMemoryUsersEventsRepository implements UsersEventsRepository {
  private usersCreatedTopic: CreatedUserMessage[] = [];

  async publishUserCreated(createUserDto: CreateUserDto): Promise<void> {
    this.usersCreatedTopic.push({
      key: 'email',
      value: createUserDto.email,
      headers: {
        role: 'admin',
      },
    });
    console.log('user-created', this.usersCreatedTopic);
  }
}
