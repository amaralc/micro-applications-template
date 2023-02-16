// users.repository.ts
import { Injectable } from '@nestjs/common';
import { Message } from 'kafkajs';
import { KafkaService } from '../../../../../infra/events/kafka/kafka.service';
import { User } from '../../../entities/user.entity';
import { USERS_TOPICS } from '../constants';
import { IUserCreatedMessagePayload } from '../types';
import { UsersEventsRepository } from '../users-events.repository';

@Injectable()
export class KafkaUsersEventsRepository implements UsersEventsRepository {
  constructor(private kafkaService: KafkaService) {}

  async publishUserCreated(user: User): Promise<void> {
    const producer = await this.kafkaService.createProducer();

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
