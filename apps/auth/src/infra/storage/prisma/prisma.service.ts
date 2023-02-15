import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../../generated';

const isPersistentStorageEnabled =
  process.env['PERSISTENT_STORAGE_ENABLED'] === 'true';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query'],
    });
  }

  async onModuleInit() {
    if (isPersistentStorageEnabled) {
      // Connect with database
      await this.$connect();
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    if (isPersistentStorageEnabled) {
      this.$on('beforeExit', async () => {
        // Close app before database shutdown
        await app.close();
      });
    }
  }
}
