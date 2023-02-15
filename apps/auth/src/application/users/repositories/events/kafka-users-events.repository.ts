// users.repository.ts
import { Injectable } from '@nestjs/common';
import { Message } from 'kafkajs';
import { KafkaService } from '../../../../infra/events/kafka/kafka.service';
import { User } from '../../entities/user.entity';
import { UsersEventsRepository } from './users-events.repository';

@Injectable()
export class KafkaUsersEventsRepository implements UsersEventsRepository {
  constructor(private kafkaService: KafkaService) {}

  async publishUserCreated(user: User): Promise<void> {
    const producer = await this.kafkaService.createProducer();

    const message: Message = {
      key: user.email,
      value: JSON.stringify({
        email: user.email,
        id: user.id,
      }),
      headers: {
        role: 'default',
      },
    };

    const result = await producer.send({
      topic: 'user-created',
      messages: [message],
    });

    console.log(result);
    await producer.disconnect();
  }
}
