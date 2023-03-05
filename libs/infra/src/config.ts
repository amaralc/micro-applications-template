import { IDatabaseProvider } from './database/types';
import { IEventsProvider } from './events/types';

export const databaseConfig = {
  databaseProvider: (process.env['DATABASE_PROVIDER'] as IDatabaseProvider) || 'memory',
};

export const eventsConfig = {
  eventsProvider: (process.env['EVENTS_PROVIDER'] as IEventsProvider) || 'kafka',
};

export const kafkaConfig = {
  broker: process.env['KAFKA_BROKER'] as string,
  clientId: process.env['KAFKA_CLIENT_ID'] as string,
  consumerGroupId: process.env['KAFKA_CONSUMER_GROUP_ID'] as string,
};
