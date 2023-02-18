import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';
import { featureFlags } from '../../../config';

const isInMemoryEventsEnabled = featureFlags.inMemoryEventsEnabled === 'true';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka | undefined;

  async onModuleInit() {
    if (isInMemoryEventsEnabled) {
      Logger.log('Skipping kafka connection...');
      return;
    }

    // Connect with kafka
    Logger.log('Connecting with kafka...');
    this.kafka = new Kafka({
      clientId: 'auth-api',
      brokers: ['localhost:9092'], // replace 'kafka:9092' with your kafka host and port
      logLevel: logLevel.NOTHING,
    });
  }

  async createProducer() {
    if (!this.kafka) {
      Logger.log('Skipping Kafka producer creation...');
      return;
    }

    Logger.log('Creating kafka producer...');
    const producer = this.kafka.producer();
    await producer.connect();
    return producer;
  }
}
