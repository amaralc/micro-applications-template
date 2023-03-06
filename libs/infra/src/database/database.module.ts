import { DynamicModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoDbConfig } from '../config';
import { PrismaService } from './prisma.service';
import { IDatabaseProvider } from './types';

@Module({})
export class DatabaseModule {
  static register({ provider }: { provider: IDatabaseProvider }): DynamicModule {
    Logger.log(`Database provider: ${provider}`, DatabaseModule.name);

    if (provider === 'mongodb') {
      return {
        module: DatabaseModule,
        imports: [MongooseModule.forRoot(mongoDbConfig.databaseUrl)],
        controllers: [],
        providers: [],
      };
    }

    if (provider === 'postgresql') {
      return {
        module: DatabaseModule,
        imports: [],
        providers: [PrismaService],
        exports: [PrismaService],
      };
    }

    return { module: DatabaseModule };
  }
}
