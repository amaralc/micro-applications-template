import { databaseConfig } from '@infra/config';
import { DynamicModule, Module } from '@nestjs/common';
import { PlanSubscriptionsDatabaseRepositoryModule } from './database/repository.module';

@Module({})
export class PlanSubscriptionsModule {
  static register(): DynamicModule {
    const dynamicProviders = [
      PlanSubscriptionsDatabaseRepositoryModule.register({ provider: databaseConfig.databaseProvider }),
    ];

    return {
      module: PlanSubscriptionsModule,
      imports: [...dynamicProviders],
      exports: [...dynamicProviders],
    };
  }
}
