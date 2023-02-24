import { Injectable, Logger } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';
import { featureFlags } from '../../../config';
import { EventsService } from '../events.service';
import { EachMessageHandler, ProducerRecord } from '../types';

const isInMemoryEventsEnabled = featureFlags.inMemoryEventsEnabled === 'true';

const className = 'KafkaEventsService';

@Injectable()
export class KafkaEventsService implements EventsService {
  private eventsManager: Kafka | undefined;

  async onModuleInit() {
    if (isInMemoryEventsEnabled) {
      Logger.log('Skipping kafka connection...');
      return;
    }

    // Connect with kafka
    Logger.log('Connecting with kafka...', className);
    this.eventsManager = new Kafka({
      clientId: 'auth-api-only',
      brokers: ['localhost:9092'], // replace 'kafka:9092' with your kafka host and port
      logLevel: logLevel.NOTHING,
    });
  }

  async publish(payload: ProducerRecord) {
    if (!this.eventsManager) {
      Logger.log('Skipping Kafka producer creation...', className);
      return;
    }

    Logger.log('Creating kafka producer...', className);
    const producer = this.eventsManager.producer();
    await producer.connect();
    if (!producer) {
      Logger.warn('Producer was not created', className);
      return;
    }

    Logger.log('Publishing message: ' + JSON.stringify(payload), className);
    await producer.send(payload);
    await producer.disconnect();
  }

  async subscribe(topic: string, callback: EachMessageHandler): Promise<void> {
    if (!this.eventsManager) {
      Logger.log('Skipping Kafka producer creation...', className);
      return;
    }

    Logger.log('Creating and running kafka consumer...', className);
    const consumer = this.eventsManager.consumer({
      groupId: 'auth-new-02',
    });
    await consumer.connect();
    await consumer.subscribe({
      topics: [topic],
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: callback,
    });
  }
}
