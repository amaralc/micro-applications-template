import { InMemoryPeersDatabaseRepository } from '@core/domains/peers/repositories/database-in-memory.repository';
import { PeersDatabaseRepository } from '@core/domains/peers/repositories/database.repository';
import { PlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database.repository';
import { ApplicationLogger } from '@core/shared/logs/application-logger';
import { NativeLogger } from '@core/shared/logs/native-logger';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configDto } from '../config.dto';
import { PostgreSqlPrismaOrmService } from './infra/prisma/postgresql-prisma-orm.service';
import { MongoDbMongooseOrmPlanSubscriptionsDatabaseRepository } from './repositories/plan-subscriptions/mongodb-mongoose-orm.repository';
import { PostgreSqlPrismaOrmPlanSubscriptionsDatabaseRepository } from './repositories/plan-subscriptions/postgresql-prisma-orm.repository';
import { MongoDbMongooseOrmPeersDatabaseRepository } from './repositories/users/mongodb-mongoose-orm.repository';
import { PostgreSqlPrismaOrmUsersDatabaseRepository } from './repositories/users/postgresql-prisma-orm.repository';
import { IDatabaseProvider } from './types';

import { InMemoryPlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database-in-memory.repository';
import {
  MongoosePlanSubscription,
  MongoosePlanSubscriptionSchema,
} from './repositories/plan-subscriptions/mongodb-mongoose-orm.entity';
import { MongoosePeer, MongoosePeerSchema } from './repositories/users/mongodb-mongoose-orm.entity';

const logger = new NativeLogger();

@Module({})
export class DatabaseRepositoriesModule {
  static register({ provider }: { provider: IDatabaseProvider }): DynamicModule {
    logger.info(`Database provider: ${provider}`, { className: DatabaseRepositoriesModule.name });

    let dynamicImports: Array<DynamicModule> = [];
    let dynamicProviders: Array<Provider> = [];

    if (provider === 'postgresql-prisma-orm') {
      dynamicProviders = [
        PostgreSqlPrismaOrmService,
        {
          provide: ApplicationLogger,
          useClass: NativeLogger,
        },
        {
          provide: PeersDatabaseRepository,
          useClass: PostgreSqlPrismaOrmUsersDatabaseRepository,
        },
        {
          provide: PlanSubscriptionsDatabaseRepository,
          useClass: PostgreSqlPrismaOrmPlanSubscriptionsDatabaseRepository,
        },
      ];
    }

    if (provider === 'mongodb-mongoose-orm') {
      dynamicImports = [
        MongooseModule.forRoot(configDto.mongoDbDatabaseUrl),
        MongooseModule.forFeature([
          {
            name: MongoosePeer.name,
            schema: MongoosePeerSchema,
          },
        ]),
        MongooseModule.forFeature([
          {
            name: MongoosePlanSubscription.name,
            schema: MongoosePlanSubscriptionSchema,
          },
        ]),
      ];

      dynamicProviders = [
        {
          provide: ApplicationLogger,
          useClass: NativeLogger,
        },
        {
          provide: PeersDatabaseRepository,
          useClass: MongoDbMongooseOrmPeersDatabaseRepository,
        },
        {
          provide: PlanSubscriptionsDatabaseRepository,
          useClass: MongoDbMongooseOrmPlanSubscriptionsDatabaseRepository,
        },
      ];
    }

    if (provider === 'in-memory') {
      dynamicProviders = [
        {
          provide: ApplicationLogger,
          useClass: NativeLogger,
        },
        {
          provide: PeersDatabaseRepository,
          useClass: InMemoryPeersDatabaseRepository,
        },
        {
          provide: PlanSubscriptionsDatabaseRepository,
          useClass: InMemoryPlanSubscriptionsDatabaseRepository,
        },
      ];
    }

    return {
      module: DatabaseRepositoriesModule,
      imports: [...dynamicImports],
      providers: [...dynamicProviders],
      exports: [...dynamicProviders],
    };
  }
}
