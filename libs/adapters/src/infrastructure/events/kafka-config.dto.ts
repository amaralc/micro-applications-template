import { kafkaConfig } from '@infra/config';

export class KafkaConfig {
  brokers: string[];
  clientId: string;
  consumerGroupId: string;

  constructor() {
    this.brokers = [kafkaConfig.brokers];
    this.clientId = kafkaConfig.clientId;
    this.consumerGroupId = kafkaConfig.consumerGroupId;
  }
}
