import { Kafka, logLevel } from 'kafkajs';

export const kafkaClient = new Kafka({
  clientId: 'auth',
  brokers: ['kafka:9092'], // replace 'kafka:9092' with your kafka host and port
  logLevel: logLevel.NOTHING,
});
