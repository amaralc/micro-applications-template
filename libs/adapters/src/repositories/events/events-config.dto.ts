import { eventsConfig, kafkaConfig } from '@infra/config';
import { IEventsProvider } from '@infra/events/types';

export class EventsConfigDto {
  provider: IEventsProvider;
  kafka?: {
    broker: string;
    clientId: string;
    consumerGroupId: string;
  };

  constructor() {
    this.provider = eventsConfig.eventsProvider;
    if (eventsConfig.eventsProvider === 'kafka') {
      this.kafka = kafkaConfig;
    }
  }
}
