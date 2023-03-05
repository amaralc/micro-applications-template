import { DynamicModule, Module, Provider } from '@nestjs/common';

import { InMemoryPlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database-in-memory.repository';
import { PlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database.repository';
import { DatabaseModule } from '@infra/database/database.module';
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
  static forRoot({ provider }: { provider: IDatabaseProvider }): DynamicModule {
    return {
      module: PlanSubscriptionsDatabaseRepositoryModule,
      imports: [
        DatabaseModule,
        MongooseModule.forFeature([
          {
            name: MongoosePlanSubscription.name,
            schema: MongoosePlanSubscriptionSchema,
          },
        ]),
      ],
      providers: [this.getRepositoryImplementation({ provider })],
      exports: [this.getRepositoryImplementation({ provider })],
    };
  }
}
