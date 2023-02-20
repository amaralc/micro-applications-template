import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from '../../infra/infra.module';
import {
  UsersDatabaseRepository,
  UsersDatabaseRepositoryImplementation,
} from './repositories/database/database.repository';
import {
  UsersEventsRepository,
  UsersEventsRepositoryImplementation,
} from './repositories/events/events.repository';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
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
    CreateUserUseCase,
    {
      provide: UsersDatabaseRepository,
      useClass: UsersDatabaseRepositoryImplementation,
    },
    {
      provide: UsersEventsRepository,
      useClass: UsersEventsRepositoryImplementation,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
