import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EachMessageHandler, Kafka, logLevel, Partitioners, ProducerRecord } from 'kafkajs';
import { kafkaConfig } from '../config';

@Injectable()
export class KafkaEventsService implements OnModuleInit {
  private eventsManager: Kafka;

  constructor() {
    this.eventsManager = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: [kafkaConfig.broker], // replace 'kafka:9092' with your kafka host and port
      logLevel: logLevel.NOTHING,
    });
  }

  async onModuleInit() {
    // Connect with kafka
    Logger.log('Connecting with kafka...', KafkaEventsService.name);
  }

  async publish(payload: ProducerRecord) {
    Logger.log('Creating kafka producer...', KafkaEventsService.name);
    const producer = this.eventsManager.producer({ createPartitioner: Partitioners.DefaultPartitioner });
    await producer.connect();

    Logger.log('Publishing message: ' + JSON.stringify(payload), KafkaEventsService.name);
    await producer.send(payload);
    await producer.disconnect();
  }

  async subscribe(topic: string, callback: EachMessageHandler): Promise<void> {
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
