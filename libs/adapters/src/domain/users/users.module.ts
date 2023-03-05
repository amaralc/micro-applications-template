import { CreateUserService } from '@core/domains/users/services/create-user.service';
import { databaseConfig, eventsConfig } from '@infra/config';
import { DatabaseModule } from '@infra/database/database.module';
import { EventsModule } from '@infra/events/events.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersDatabaseRepositoryModule } from './repositories/database/repository.module';
import { UsersEventsRepositoryModule } from './repositories/events/repository.module';
import { UsersController } from './users.controller';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    DatabaseModule,
    EventsModule,
    UsersDatabaseRepositoryModule.forRoot({ provider: databaseConfig.databaseProvider }),
    UsersEventsRepositoryModule.forRoot({ provider: eventsConfig.eventsProvider }),
  ],
  controllers: [UsersController],
  providers: [CreateUserService],
  exports: [CreateUserService],
})
export class UsersModule {}
