import { UsersRestController } from '@adapters/domains/users/controllers/rest.controller';
import { UsersModule } from '@adapters/domains/users/users.module';
import { DatabaseConfigDto } from '@adapters/infra/database-config.dto';
import { EventsConfigDto } from '@adapters/infra/events-config.dto';
import { CreateUserService } from '@core/domains/users/services/create-user.service';
import { DatabaseModule } from '@infra/database/database.module';
import { EventsModule } from '@infra/events/events.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const databaseConfig = new DatabaseConfigDto();
const eventsConfig = new EventsConfigDto();

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    DatabaseModule.register({ provider: databaseConfig.provider }),
    EventsModule.register({ provider: eventsConfig.provider }),
    UsersModule.register(),
  ],
  controllers: [UsersRestController],
  providers: [CreateUserService],
  exports: [],
})
export class MainModule {}
