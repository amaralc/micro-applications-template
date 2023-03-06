import { DynamicModule, Logger, Module } from '@nestjs/common';
import { KafkaEventsService } from './kafka-events.service';
import { IEventsProvider } from './types';

@Module({})
export class EventsModule {
  static register({ provider }: { provider: IEventsProvider }): DynamicModule {
    Logger.log(`Events provider: ${provider}`, EventsModule.name);
    if (provider === 'kafka') {
      return {
        module: EventsModule,
        imports: [],
        controllers: [],
        providers: [KafkaEventsService],
        exports: [KafkaEventsService],
      };
    }

    return { module: EventsModule };
  }
}
