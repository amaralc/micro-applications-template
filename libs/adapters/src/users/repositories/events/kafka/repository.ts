// users.repository.ts
import { UserEntity } from '@core/domains/users/entities/user.entity';
import { UsersEventsRepository } from '@core/domains/users/repositories/events.repository';
import { USERS_TOPICS } from '@core/domains/users/topics';
import { EventsService } from '@infra/events/events.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KafkaUsersEventsRepository implements UsersEventsRepository {
  constructor(private eventsService: EventsService) {}

  async publishUserCreated(userEntity: UserEntity): Promise<void> {
    this.eventsService.publish({
      topic: USERS_TOPICS['USER_CREATED'],
      messages: [
        {
          value: JSON.stringify({
            id: userEntity.id,
            email: userEntity.email,
          }),
        },
      ],
    });
  }
}
