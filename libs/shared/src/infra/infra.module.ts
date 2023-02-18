import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsService } from './events/events.service';
import { InMemoryEventsService } from './events/implementations/in-memory-events.service';
import { PrismaService } from './storage/prisma/prisma.service';

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
  providers: [
    PrismaService,
    {
      provide: EventsService,
      useClass: InMemoryEventsService,
    },
  ],
  exports: [
    {
      provide: EventsService,
      useClass: InMemoryEventsService,
    },
    PrismaService,
  ],
})
export class InfraModule {}
