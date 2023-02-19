import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  EventsService,
  EventsServiceImplementation,
} from './events/events.service';
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
      useClass: EventsServiceImplementation,
    },
  ],
  exports: [
    PrismaService,
    {
      provide: EventsService,
      useClass: EventsServiceImplementation,
    },
  ],
})
export class InfraModule {}
