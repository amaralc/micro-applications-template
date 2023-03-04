// users.repository.ts
import { EventsService } from '@infra/events/events.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { USERS_TOPICS } from '../topics';
import { UsersEventsRepository } from './events.repository';

@Injectable()
export class InMemoryUsersEventsRepository implements UsersEventsRepository {
  constructor(private eventsService: EventsService) {}

  async publishUserCreated(user: UserEntity): Promise<void> {
    this.eventsService.publish({
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
