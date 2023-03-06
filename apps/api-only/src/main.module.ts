import { DatabaseRepositoriesModule } from '@adapters/domains/database-repositories.module';
import { EventsRepositoriesModule } from '@adapters/domains/events-repositories.module';
import { PlanSubscriptionsRestController } from '@adapters/domains/plan-subscriptions/controllers/rest.controller';
import { UsersRestController } from '@adapters/domains/users/controllers/rest.controller';
import { DatabaseConfigDto } from '@adapters/infra/database-config.dto';
import { EventsConfigDto } from '@adapters/infra/events-config.dto';
import { CreatePlanSubscriptionService } from '@core/domains/plan-subscriptions/services/create-plan-subscription.service';
import { ListPaginatedPlanSubscriptionsService } from '@core/domains/plan-subscriptions/services/list-paginated-plan-subscriptions.service';
import { CreateUserService } from '@core/domains/users/services/create-user.service';
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
    DatabaseRepositoriesModule.register({ provider: databaseConfig.provider }),
    EventsRepositoriesModule.register({ provider: eventsConfig.provider }),
  ],
  controllers: [UsersRestController, PlanSubscriptionsRestController],
  providers: [CreateUserService, CreatePlanSubscriptionService, ListPaginatedPlanSubscriptionsService],
  exports: [],
})
export class MainModule {}
