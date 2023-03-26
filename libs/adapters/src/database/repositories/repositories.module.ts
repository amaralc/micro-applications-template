import { InMemoryPlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database-in-memory.repository';
import { PlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database.repository';
import { InMemoryUsersDatabaseRepository } from '@core/domains/users/repositories/database-in-memory.repository';
import { UsersDatabaseRepository } from '@core/domains/users/repositories/database.repository';
import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configDto } from '../../config.dto';
import { PostgreSqlPrismaOrmService } from '../infra/prisma/postgresql-prisma-orm.service';
import { IDatabaseProvider } from '../types';
import { MongoosePlanSubscription, MongoosePlanSubscriptionSchema } from './plan-subscriptions/mongoose-mongodb.entity';
import { MongooseMongoDbPlanSubscriptionsDatabaseRepository } from './plan-subscriptions/mongoose-mongodb.repository';
import { PrismaPostgreSqlPlanSubscriptionsDatabaseRepository } from './plan-subscriptions/prisma-postgresql.repository';
import { MongooseUser, MongooseUserSchema } from './users/mongoose-mongodb.entity';
import { MongooseMongoDbUsersDatabaseRepository } from './users/mongoose-mongodb.repository';
import { PrismaPostgreSqlUsersDatabaseRepository } from './users/prisma-postgres.repository';

@Module({})
export class DatabaseRepositoriesModule {
  // Initialize repository
  static register({ provider }: { provider: IDatabaseProvider }): DynamicModule {
    Logger.log(`Database provider: ${provider}`, DatabaseRepositoriesModule.name);
    let dynamicImports: Array<DynamicModule> = [];
    let dynamicProviders: Array<Provider> = [];

    if (provider === 'mongodb') {
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
          useClass: MongooseMongoDbUsersDatabaseRepository,
        },
        {
          provide: PlanSubscriptionsDatabaseRepository,
          useClass: MongooseMongoDbPlanSubscriptionsDatabaseRepository,
        },
      ];
    }

    if (provider === 'postgresql') {
      dynamicProviders = [
        PostgreSqlPrismaOrmService,
        {
          provide: UsersDatabaseRepository,
          useClass: PrismaPostgreSqlUsersDatabaseRepository,
        },
        {
          provide: PlanSubscriptionsDatabaseRepository,
          useClass: PrismaPostgreSqlPlanSubscriptionsDatabaseRepository,
        },
      ];
    }

    if (provider === 'memory') {
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
