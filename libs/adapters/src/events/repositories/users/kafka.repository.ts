// users.repository.ts
import { USERS_TOPICS } from '@core/domains/users/constants/topics';
import { UserEntity } from '@core/domains/users/entities/user/entity';
import { UsersEventsRepository } from '@core/domains/users/repositories/events.repository';
import { Injectable } from '@nestjs/common';
import { KafkaEventsService } from '../../infra/kafka-events.service';

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
