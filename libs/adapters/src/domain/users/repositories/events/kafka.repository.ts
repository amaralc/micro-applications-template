// users.repository.ts
import { UserEntity } from '@core/domains/users/entities/user.entity';
import { UsersEventsRepository } from '@core/domains/users/repositories/events.repository';
import { USERS_TOPICS } from '@core/domains/users/topics';
import { KafkaEventsService } from '@infra/events/kafka-events.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KafkaUsersEventsRepository implements UsersEventsRepository {
  constructor(private kafkaEventsService: KafkaEventsService) {}

  async publishUserCreated(userEntity: UserEntity): Promise<void> {
    this.kafkaEventsService.publish({
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
