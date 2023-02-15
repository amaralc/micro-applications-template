import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';

const isPersistentStorageEnabled =
  process.env['PERSISTENT_STORAGE_ENABLED'] === 'true';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;

  async createProducer() {
    if (isPersistentStorageEnabled) {
      const producer = this.kafka.producer();
      await producer.connect();
      return producer;
    }
  }

  async onModuleInit() {
    // Connect with kafka
    if (isPersistentStorageEnabled) {
      Logger.log('Connecting with Kafka...');
      this.kafka = new Kafka({
        clientId: 'auth',
        brokers: ['localhost:9092'], // replace 'kafka:9092' with your kafka host and port
        logLevel: logLevel.NOTHING,
      });
    }
  }
}
