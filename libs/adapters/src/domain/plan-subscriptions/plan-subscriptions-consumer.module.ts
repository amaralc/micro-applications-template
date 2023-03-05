import { CreatePlanSubscriptionService } from '@core/domains/plan-subscriptions/services/create-plan-subscription.service';
import { HandlePlanSubscriptionCreatedService } from '@core/domains/plan-subscriptions/services/handle-plan-subscription-created.service';
import { CreateUserService } from '@core/domains/users/services/create-user.service';
import { databaseConfig, eventsConfig } from '@infra/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersDatabaseRepositoryModule } from '../users/repositories/database/repository.module';
import { UsersEventsRepositoryModule } from '../users/repositories/events/repository.module';
import { KafkaPlanSubscriptionConsumerController } from './plan-subscription-consumer.controller';
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
  controllers: [KafkaPlanSubscriptionConsumerController],
  providers: [CreateUserService, CreatePlanSubscriptionService, HandlePlanSubscriptionCreatedService],
})
export class PlanSubscriptionConsumerModule {}
