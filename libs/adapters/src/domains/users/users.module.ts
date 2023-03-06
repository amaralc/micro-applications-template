import { databaseConfig, eventsConfig } from '@infra/config';
import { DynamicModule, Module } from '@nestjs/common';
import { UsersDatabaseRepositoryModule } from './database/repository.module';
import { UsersEventsRepositoryModule } from './events/repository.module';

@Module({})
export class UsersModule {
  static register(): DynamicModule {
    const dynamicProviders = [
      UsersDatabaseRepositoryModule.register({ provider: databaseConfig.databaseProvider }),
      UsersEventsRepositoryModule.register({ provider: eventsConfig.eventsProvider }),
    ];

    return {
      module: UsersModule,
      imports: [...dynamicProviders],
      exports: [...dynamicProviders],
    };
  }
}
