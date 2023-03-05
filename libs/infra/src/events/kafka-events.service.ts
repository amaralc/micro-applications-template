import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EachMessageHandler, Kafka, logLevel, ProducerRecord } from 'kafkajs';
import { featureFlags, kafkaConfig } from '../config';

const isInMemoryEventsEnabled = featureFlags.inMemoryEventsEnabled === 'true';

@Injectable()
export class KafkaEventsService implements OnModuleInit {
  private eventsManager: Kafka | undefined;

  async onModuleInit() {
    if (isInMemoryEventsEnabled) {
      Logger.log('Skipping kafka connection...');
      return;
    }

    // Connect with kafka
    Logger.log('Connecting with kafka...', KafkaEventsService.name);
    this.eventsManager = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: [kafkaConfig.broker], // replace 'kafka:9092' with your kafka host and port
      logLevel: logLevel.NOTHING,
    });
  }

  async publish(payload: ProducerRecord) {
    if (!this.eventsManager) {
      Logger.log('Skipping Kafka producer creation...', KafkaEventsService.name);
      return;
    }

    Logger.log('Creating kafka producer...', KafkaEventsService.name);
    const producer = this.eventsManager.producer();
    await producer.connect();
    if (!producer) {
      Logger.warn('Producer was not created', KafkaEventsService.name);
      return;
    }

    Logger.log('Publishing message: ' + JSON.stringify(payload), KafkaEventsService.name);
    await producer.send(payload);
    await producer.disconnect();
  }

  async subscribe(topic: string, callback: EachMessageHandler): Promise<void> {
    if (!this.eventsManager) {
      Logger.log('Skipping Kafka producer creation...', KafkaEventsService.name);
      return;
    }

    Logger.log('Creating and running kafka consumer...', KafkaEventsService.name);
    const consumer = this.eventsManager.consumer({
      groupId: kafkaConfig.consumerGroupId,
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
