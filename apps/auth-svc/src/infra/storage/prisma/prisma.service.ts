import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '../../../../generated';
import { featureFlags } from '../../../config';

const isInMemoryStorageEnabled = featureFlags.inMemoryStorageEnabled === 'true';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query'],
    });
  }

  async onModuleInit() {
    if (isInMemoryStorageEnabled) {
      Logger.log('Skipping database connection...');
      return;
    }

    Logger.log('Connecting with database...');
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    if (isInMemoryStorageEnabled) {
      Logger.log('Skipping shudown hook...');
      return;
    }

    this.$on('beforeExit', async () => {
      Logger.log('Closing app before database shutdown...');
      await app.close();
    });
  }
}
