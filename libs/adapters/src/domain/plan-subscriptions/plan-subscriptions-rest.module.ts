import { CreatePlanSubscriptionService } from '@core/domains/plan-subscriptions/services/create-plan-subscription.service';
import { ListPaginatedPlanSubscriptionsService } from '@core/domains/plan-subscriptions/services/list-paginated-plan-subscriptions.service';
import { CreateUserService } from '@core/domains/users/services/create-user.service';
import { databaseConfig, eventsConfig } from '@infra/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersDatabaseRepositoryModule } from '../users/repositories/database/repository.module';
import { UsersEventsRepositoryModule } from '../users/repositories/events/repository.module';
import { PlanSubscriptionsRestController } from './plan-subscriptions-rest.controller';
import { PlanSubscriptionsDatabaseRepositoryModule } from './repositories/database/repository.module';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    UsersDatabaseRepositoryModule.forRoot({ provider: databaseConfig.databaseProvider }),
    UsersEventsRepositoryModule.forRoot({ provider: eventsConfig.eventsProvider }),
    PlanSubscriptionsDatabaseRepositoryModule.forRoot({ provider: databaseConfig.databaseProvider }),
  ],
  controllers: [PlanSubscriptionsRestController],
  providers: [ListPaginatedPlanSubscriptionsService, CreatePlanSubscriptionService, CreateUserService],
  exports: [],
})
export class PlanSubscriptionsRestModule {}
