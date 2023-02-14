// users.repository.ts
import { Injectable } from '@nestjs/common';
import { Message } from 'kafkajs';
import { KafkaService } from '../../../../infra/events/kafka/kafka.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UsersEventsRepository } from './users-events.repository';

@Injectable()
export class KafkaUsersEventsRepository implements UsersEventsRepository {
  constructor(private kafkaService: KafkaService) {}

  async publishUserCreated(createUserDto: CreateUserDto): Promise<void> {
    const producer = await this.kafkaService.createProducer();
    const { email } = createUserDto;
    const message: Message = {
      key: 'email',
      value: email,
      headers: {
        role: 'admin',
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
