import { Injectable } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';

@Injectable()
export class KafkaService {
  private readonly kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka:9092'], // replace 'kafka:9092' with your kafka host and port
    logLevel: logLevel.NOTHING,
  });

  async createProducer() {
    const producer = this.kafka.producer();
    await producer.connect();
    return producer;
  }
}
