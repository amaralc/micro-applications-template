export const featureFlags = {
  inMemoryDatabaseEnabled: process.env['FLAG_IN_MEMORY_DATABASE_ENABLED'],
  inMemoryEventsEnabled: process.env['FLAG_IN_MEMORY_EVENTS_ENABLED'],
  useMongoDbInsteadOfPostgreSql:
    process.env['FLAG_USE_MONGODB_INSTEAD_OF_POSTGRESQL'],
};
