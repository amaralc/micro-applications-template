import { DatabaseConfigDto } from '@adapters/repositories/database/database-config.dto';
import { DatabaseRepositoriesModule } from '@adapters/repositories/database/database-repositories.module';
import { EventsConfigDto } from '@adapters/repositories/events/events-config.dto';
import { EventsRepositoriesModule } from '@adapters/repositories/events/events-repositories.module';
import { CreatePlanSubscriptionService } from '@core/domains/plan-subscriptions/services/create-plan-subscription.service';
import { ListPaginatedPlanSubscriptionsService } from '@core/domains/plan-subscriptions/services/list-paginated-plan-subscriptions.service';
import { CreateUserService } from '@core/domains/users/services/create-user.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlanSubscriptionsRestController } from './controllers/plan-subscriptions.controller';
import { UsersRestController } from './controllers/users.controller';

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
    DatabaseRepositoriesModule.register({ provider: databaseConfig.provider }),
    EventsRepositoriesModule.register({ provider: eventsConfig.provider }),
  ],
  controllers: [UsersRestController, PlanSubscriptionsRestController],
  providers: [CreateUserService, CreatePlanSubscriptionService, ListPaginatedPlanSubscriptionsService],
  exports: [],
})
export class MainModule {}
