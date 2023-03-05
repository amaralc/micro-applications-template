import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaEventsService } from './kafka-events.service';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [KafkaEventsService],
  exports: [KafkaEventsService],
})
export class EventsModule {}
