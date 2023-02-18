import { Logger, OnModuleInit } from '@nestjs/common';
import { ProducerRecord } from 'kafkajs';
import { featureFlags } from '../../config';
import { InMemoryEventsService } from './implementations/in-memory-events.service';
import { KafkaEventsService } from './implementations/kafka.service';
import { EachMessageHandler } from './types';

export abstract class EventsService implements OnModuleInit {
  abstract publish(payload: ProducerRecord): Promise<void>;
  abstract subscribe(
    topic: string,
    callback: EachMessageHandler
  ): Promise<void>;
  abstract onModuleInit(): Promise<void>;
}

// Implementation
const isInMemoryEventsEnabled = featureFlags.inMemoryEventsEnabled === 'true';
export const UsersDatabaseRepositoryImplementation = isInMemoryEventsEnabled
  ? InMemoryEventsService
  : KafkaEventsService;

Logger.log(
  isInMemoryEventsEnabled
    ? 'Using in memory database...'
    : 'Using persistent database...'
);
