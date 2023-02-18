import {
  UsersDatabaseRepository,
  UsersDatabaseRepositoryImplementation,
} from '@auth/shared/domains/users/repositories/database/users-database.repository';
import {
  UsersEventsRepository,
  UsersEventsRepositoryImplementation,
} from '@auth/shared/domains/users/repositories/events/users-events.repository';
import { InfraModule } from '@auth/shared/infra/infra.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
      provide: UsersDatabaseRepository,
      useClass: UsersDatabaseRepositoryImplementation,
    },
    {
      provide: UsersEventsRepository,
      useClass: UsersEventsRepositoryImplementation,
    },
  ],
})
export class UsersModule {}
