import { InMemoryUsersEventsRepository } from '@core/domains/users/repositories/events-in-memory.repository';
import { UsersEventsRepository } from '@core/domains/users/repositories/events.repository';
import { IEventsProvider } from '@core/shared/infra/events.types';
import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { KafkaEventsService } from '../infra/kafka-events.service';
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

    if (provider === 'in-memory') {
      dynamicProviders = [{ provide: UsersEventsRepository, useClass: InMemoryUsersEventsRepository }];
    }

    return {
      module: EventsRepositoriesModule,
      providers: [...dynamicProviders],
      exports: [...dynamicProviders],
    };
  }
}
