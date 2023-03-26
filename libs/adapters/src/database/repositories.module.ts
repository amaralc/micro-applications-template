import { PlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database.repository';
import { InMemoryUsersDatabaseRepository } from '@core/domains/users/repositories/database-in-memory.repository';
import { UsersDatabaseRepository } from '@core/domains/users/repositories/database.repository';
import { ApplicationLogger } from '@core/shared/logs/application-logger';
import { NativeLogger } from '@core/shared/logs/native-logger';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configDto } from '../config.dto';
import { PostgreSqlPrismaOrmService } from './infra/prisma/postgresql-prisma-orm.service';
import { MongoDbMongooseOrmPlanSubscriptionsDatabaseRepository } from './repositories/plan-subscriptions/mongodb-mongoose-orm.repository';
import { PostgreSqlPrismaOrmPlanSubscriptionsDatabaseRepository } from './repositories/plan-subscriptions/postgresql-prisma-orm.repository';
import { MongoDbMongooseOrmUsersDatabaseRepository } from './repositories/users/mongodb-mongoose-orm.repository';
import { PostgreSqlPrismaOrmUsersDatabaseRepository } from './repositories/users/postgresql-prisma-orm.repository';
import { IDatabaseProvider } from './types';

import { InMemoryPlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database-in-memory.repository';
import {
  MongoosePlanSubscription,
  MongoosePlanSubscriptionSchema,
} from './repositories/plan-subscriptions/mongodb-mongoose-orm.entity';
import { MongooseUser, MongooseUserSchema } from './repositories/users/mongodb-mongoose-orm.entity';

const logger = new NativeLogger();

@Module({})
export class DatabaseRepositoriesModule {
  static register({ provider }: { provider: IDatabaseProvider }): DynamicModule {
    logger.info(`Database provider: ${provider}`, { className: DatabaseRepositoriesModule.name });

    let dynamicImports: Array<DynamicModule> = [];
    let dynamicProviders: Array<Provider> = [];

    if (provider === 'postgresql-prisma-orm') {
      dynamicProviders = [
        {
          provide: ApplicationLogger,
          useClass: NativeLogger,
        },
        PostgreSqlPrismaOrmService,
        {
          provide: UsersDatabaseRepository,
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
            name: MongooseUser.name,
            schema: MongooseUserSchema,
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
          provide: UsersDatabaseRepository,
          useClass: MongoDbMongooseOrmUsersDatabaseRepository,
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
          provide: UsersDatabaseRepository,
          useClass: InMemoryUsersDatabaseRepository,
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
