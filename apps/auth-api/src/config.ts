export const featureFlags = {
  inMemoryStorageEnabled:
    process.env['FEATURE_FLAGS_IN_MEMORY_STORAGE_ENABLED'],
  useMongoDBInsteadOfPostgreSQL:
    process.env['FEATURE_FLAGS_USE_MONGODB_INSTEAD_OF_POSTGRESQL'],
};
