import { OnModuleInit } from '@nestjs/common';
import { ProducerRecord } from 'kafkajs';
import { KafkaEventsService } from './kafka-events.service';
import { EachMessageHandler } from './kafka.types';

export abstract class EventsService implements OnModuleInit {
  abstract publish(payload: ProducerRecord): Promise<void>;
  abstract subscribe(topic: string, callback: EachMessageHandler): Promise<void>;
  abstract onModuleInit(): Promise<void>;
}

// Implementation
export const EventsServiceImplementation = KafkaEventsService;
