// users.repository.ts
import { Injectable } from '@nestjs/common';
import { EventsService } from '../../../../../infra/events/events.service';
import { User } from '../../../entities/user.entity';
import { UsersEventsRepository } from '../events.repository';
import { USERS_TOPICS } from '../topics';

@Injectable()
export class KafkaUsersEventsRepository implements UsersEventsRepository {
  constructor(private eventsService: EventsService) {}

  async publishUserCreated(user: User): Promise<void> {
    this.eventsService.publish({
      topic: USERS_TOPICS['USER_CREATED'],
      messages: [
        {
          value: JSON.stringify({
            id: user.id,
            email: user.email,
          }),
        },
      ],
    });
  }
}
