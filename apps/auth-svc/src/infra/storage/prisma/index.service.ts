import { Logger } from '@nestjs/common';
import { featureFlags } from '../../../config';
import { PrismaPostgreSQLService } from './prisma-postgresql.service';

const useMongoDb = featureFlags.useMongoDBInsteadOfPostgreSQL === 'true';

export const UsersEventsRepositoryImplementation = useMongoDb
  ? PrismaPostgreSQLService
  : PrismaPostgreSQLService;

Logger.log(
  useMongoDb
    ? 'Using MongoDB database implementation...'
    : 'Using PostgreSQL database implementation...'
);
