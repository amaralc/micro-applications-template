import { OnModuleInit } from '@nestjs/common';
import { ProducerRecord } from 'kafkajs';

export abstract class EventsService implements OnModuleInit {
  abstract publish(payload: ProducerRecord): Promise<void>;
  // abstract subscribe(
  //   topic: string,
  //   callback: EachMessageHandler
  // ): Promise<void>;
  abstract onModuleInit(): Promise<void>;
}
