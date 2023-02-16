import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from '../../infra/infra.module';
import { UsersEventsRepositoryImplementation } from './repositories/events/implementation/index.repository';
import { UsersEventsRepository } from './repositories/events/users-events.repository';
import { UsersStorageRepositoryImplementation } from './repositories/storage/implementation/index.repository';
import { UsersStorageRepository } from './repositories/storage/users-storage.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    InfraModule,
  ],
  controllers: [UsersController],
  providers: [
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
export class UsersModule {}
