import { InMemoryUsersEventsRepository } from '@core/domains/users/repositories/events-in-memory.repository';
import { UsersEventsRepository } from '@core/domains/users/repositories/events.repository';
import { KafkaEventsService } from '@infra/events/kafka-events.service';
import { IEventsProvider } from '@infra/events/types';
import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { KafkaUsersEventsRepository } from './users/kafka.repository';

@Module({})
export class EventsRepositoriesModule {
  // Initialize repository
  static register({ provider }: { provider: IEventsProvider }): DynamicModule {
    Logger.log(`Events provider: ${provider}`, EventsRepositoriesModule.name);
    let dynamicProviders: Array<Provider> = [];

    if (provider === 'kafka') {
      dynamicProviders = [KafkaEventsService, { provide: UsersEventsRepository, useClass: KafkaUsersEventsRepository }];
    }

    if (provider === 'memory') {
      dynamicProviders = [{ provide: UsersEventsRepository, useClass: InMemoryUsersEventsRepository }];
    }

    return {
      module: EventsRepositoriesModule,
      providers: [...dynamicProviders],
      exports: [...dynamicProviders],
    };
  }
}
