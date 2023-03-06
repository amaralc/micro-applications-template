import { DynamicModule, Module, Provider } from '@nestjs/common';

import { InMemoryPlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database-in-memory.repository';
import { PlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database.repository';
import { PrismaService } from '@infra/database/prisma.service';
import { IDatabaseProvider } from '@infra/database/types';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoosePlanSubscription, MongoosePlanSubscriptionSchema } from './mongoose-mongodb.entity';
import { MongooseMongoDbPlanSubscriptionsDatabaseRepository } from './mongoose-mongodb.repository';
import { PrismaPostgreSqlPlanSubscriptionsDatabaseRepository } from './prisma-postgresql.repository';

@Module({})
export class PlanSubscriptionsDatabaseRepositoryModule {
  // Get the repository implementation based on the provider
  static getRepositoryImplementation({ provider }: { provider: IDatabaseProvider }): Provider {
    const repositoryImplementations = {
      memory: InMemoryPlanSubscriptionsDatabaseRepository,
      mongodb: MongooseMongoDbPlanSubscriptionsDatabaseRepository,
      postgresql: PrismaPostgreSqlPlanSubscriptionsDatabaseRepository,
    };

    return {
      provide: PlanSubscriptionsDatabaseRepository,
      useClass: repositoryImplementations[provider],
    };
  }

  // Initialize repository
  static register({ provider }: { provider: IDatabaseProvider }): DynamicModule {
    let dynamicImports: Array<DynamicModule> = [];
    let dynamicProviders: Array<Provider> = [];

    if (provider === 'mongodb') {
      dynamicImports = [
        MongooseModule.forFeature([
          {
            name: MongoosePlanSubscription.name,
            schema: MongoosePlanSubscriptionSchema,
          },
        ]),
      ];

      dynamicProviders = [
        {
          provide: PlanSubscriptionsDatabaseRepository,
          useClass: MongooseMongoDbPlanSubscriptionsDatabaseRepository,
        },
      ];
    }

    if (provider === 'postgresql') {
      dynamicProviders = [
        PrismaService,
        {
          provide: PlanSubscriptionsDatabaseRepository,
          useClass: PrismaPostgreSqlPlanSubscriptionsDatabaseRepository,
        },
      ];
    }

    if (provider === 'memory') {
      dynamicProviders = [
        {
          provide: PlanSubscriptionsDatabaseRepository,
          useClass: InMemoryPlanSubscriptionsDatabaseRepository,
        },
      ];
    }

    return {
      module: PlanSubscriptionsDatabaseRepositoryModule,
      imports: [...dynamicImports],
      providers: [...dynamicProviders],
      exports: [...dynamicProviders],
    };
  }
}
