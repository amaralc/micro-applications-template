import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  UsersEventsRepository,
  UsersEventsRepositoryImplementation,
} from './application/users/repositories/events/users-events.repository';
import {
  UsersStorageRepository,
  UsersStorageRepositoryImplementation,
} from './application/users/repositories/storage/users-storage.repository';
import { UsersController } from './application/users/users.controller';
import { UsersService } from './application/users/users.service';
import { KafkaService } from './infra/events/kafka/kafka.service';
import { PrismaService } from './infra/storage/prisma/prisma.service';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
  ],
  controllers: [UsersController],
  providers: [
    KafkaService,
    PrismaService,
    UsersService,
    {
      provide: UsersStorageRepository,
      useClass: UsersStorageRepositoryImplementation,
    },
    {
      provide: UsersEventsRepository,
      useClass: UsersEventsRepositoryImplementation,
    },
  ],
})
export class RootModule {}
