export const featureFlags = {
  inMemoryDatabaseEnabled: process.env['FLAG_IN_MEMORY_DATABASE_ENABLED'],
  inMemoryEventsEnabled: process.env['FLAG_IN_MEMORY_EVENTS_ENABLED'],
  useMongoDbInsteadOfPostgreSql: process.env['FLAG_USE_MONGODB_INSTEAD_OF_POSTGRESQL'],
};

export const kafkaConfig = {
  broker: process.env['KAFKA_BROKER'] as string,
  clientId: process.env['KAFKA_CLIENT_ID'] as string,
  consumerGroupId: process.env['KAFKA_CONSUMER_GROUP_ID'] as string,
};
