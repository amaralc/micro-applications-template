// users.repository.ts
import { Injectable } from '@nestjs/common';
import { KafkaEventsService } from '../../../../../infra/events/implementations/kafka.service';
import { User } from '../../../entities/user.entity';
import { USERS_TOPICS } from '../topics';
import { UsersEventsRepository } from '../users-events.repository';

@Injectable()
export class KafkaUsersEventsRepository implements UsersEventsRepository {
  constructor(private kafkaEventsService: KafkaEventsService) {}

  async publishUserCreated(user: User): Promise<void> {
    this.kafkaEventsService.publish({
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
