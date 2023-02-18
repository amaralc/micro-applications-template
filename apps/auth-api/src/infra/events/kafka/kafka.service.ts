import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';
import { featureFlags } from '../../../config';

const isInMemoryStorageEnabled = featureFlags.inMemoryStorageEnabled === 'true';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;

  async createProducer() {
    if (isInMemoryStorageEnabled) {
      Logger.log('Skipping Kafka producer creation...');
      return;
    }

    Logger.log('Creating kafka producer...');
    const producer = this.kafka.producer();
    await producer.connect();
    return producer;
  }

  async onModuleInit() {
    if (isInMemoryStorageEnabled) {
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
}
