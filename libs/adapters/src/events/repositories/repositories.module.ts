import { InMemoryUsersEventsRepository } from '@core/domains/peers/repositories/events-in-memory.repository';
import { PeersEventsRepository } from '@core/domains/peers/repositories/events.repository';
import { IEventsProvider } from '@core/shared/infra/events.types';
import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { KafkaEventsService } from '../infra/kafka-events.service';
import { KafkaUsersEventsRepository } from './peers/kafka.repository';

@Module({})
export class EventsRepositoriesModule {
  // Initialize repository
  static register({ provider }: { provider: IEventsProvider }): DynamicModule {
    Logger.log(`Events provider: ${provider}`, EventsRepositoriesModule.name);
    let dynamicProviders: Array<Provider> = [];

    if (provider === 'kafka') {
      dynamicProviders = [KafkaEventsService, { provide: PeersEventsRepository, useClass: KafkaUsersEventsRepository }];
    }

    if (provider === 'in-memory') {
      dynamicProviders = [{ provide: PeersEventsRepository, useClass: InMemoryUsersEventsRepository }];
    }

    return {
      module: EventsRepositoriesModule,
      providers: [...dynamicProviders],
      exports: [...dynamicProviders],
    };
  }
}
