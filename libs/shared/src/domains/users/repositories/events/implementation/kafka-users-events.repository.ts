// users.repository.ts
import { Injectable } from '@nestjs/common';
import { KafkaService } from '../../../../../infra/events/implementations/kafka.service';
import { User } from '../../../entities/user.entity';
import { USERS_TOPICS } from '../topics';
import { UsersEventsRepository } from '../users-events.repository';

@Injectable()
export class KafkaUsersEventsRepository implements UsersEventsRepository {
  constructor(private kafkaService: KafkaService) {}

  async publishUserCreated(user: User): Promise<void> {
    this.kafkaService.publish({
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
