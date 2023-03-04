// users.repository.ts
import { User } from '@core/domains/users/entities/user.entity';
import { UsersEventsRepository } from '@core/domains/users/repositories/events.repository';
import { EventsService } from '@infra/events/events.service';
import { Injectable } from '@nestjs/common';
import { USERS_TOPICS } from '../../../../../../core/src/domains/users/topics';

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
