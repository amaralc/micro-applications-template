import { Injectable, Logger } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';
import { featureFlags } from '../../../config';
import { EventsService } from '../events.service';
import { ProducerRecord } from '../types';

const isInMemoryEventsEnabled = featureFlags.inMemoryEventsEnabled === 'true';

@Injectable()
export class KafkaEventsService implements EventsService {
  private eventsManager: Kafka | undefined;

  async onModuleInit() {
    if (isInMemoryEventsEnabled) {
      Logger.log('Skipping kafka connection...');
      return;
    }

    // Connect with kafka
    Logger.log('Connecting with kafka...');
    this.eventsManager = new Kafka({
      clientId: 'auth-api',
      brokers: ['localhost:9092'], // replace 'kafka:9092' with your kafka host and port
      logLevel: logLevel.NOTHING,
    });
  }

  async publish(payload: ProducerRecord) {
    if (!this.eventsManager) {
      Logger.log('Skipping Kafka producer creation...');
      return;
    }

    Logger.log('Creating kafka producer...');
    const producer = this.eventsManager.producer();
    await producer.connect();
    if (!producer) {
      Logger.warn('Producer was not created');
      return;
    }
    await producer.send(payload);
    await producer.disconnect();
  }
}
