// users.repository.ts
import { Injectable, Logger } from '@nestjs/common';
import { Message } from 'kafkajs';
import { KafkaService } from '../../../../../infra/events/kafka/kafka.service';
import { User } from '../../../entities/user.entity';
import { IUserCreatedMessagePayload } from '../dto/types';
import { USERS_TOPICS } from '../topics';
import { UsersEventsRepository } from '../users-events.repository';

@Injectable()
export class KafkaUsersEventsRepository implements UsersEventsRepository {
  constructor(private kafkaService: KafkaService) {}

  async publishUserCreated(user: User): Promise<void> {
    const producer = await this.kafkaService.createProducer();
    if (!producer) {
      Logger.warn('Producer was not created');
      return;
    }

    const messagePayload: IUserCreatedMessagePayload = {
      email: user.email,
      id: user.id,
    };

    const message: Message = {
      key: user.email,
      value: JSON.stringify(messagePayload),
    };

    const result = await producer.send({
      topic: USERS_TOPICS['USER_CREATED'],
      messages: [message],
    });

    console.log(result);
    await producer.disconnect();
  }
}
