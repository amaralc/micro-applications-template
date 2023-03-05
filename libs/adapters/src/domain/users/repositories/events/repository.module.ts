import { UsersEventsRepository } from '@core/domains/users/repositories/events.repository';
import { EventsModule } from '@infra/events/events.module';
import { IEventsProvider } from '@infra/events/types';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { KafkaUsersEventsRepository } from './kafka.repository';

@Module({})
export class UsersEventsRepositoryModule {
  // Get the repository implementation based on the provider
  static getRepositoryImplementation({ provider }: { provider: IEventsProvider }): Provider {
    const repositoryImplementations = {
      kafka: KafkaUsersEventsRepository,
    };

    return {
      provide: UsersEventsRepository,
      useClass: repositoryImplementations[provider],
    };
  }

  // Initialize repository
  static forRoot({ provider }: { provider: IEventsProvider }): DynamicModule {
    return {
      module: UsersEventsRepositoryModule,
      imports: [EventsModule],
      providers: [this.getRepositoryImplementation({ provider })],
      exports: [this.getRepositoryImplementation({ provider })],
    };
  }
}
