import { DatabaseRepositoriesModule } from '@adapters/domains/database-repositories.module';
import { PlanSubscriptionsConsumerController } from '@adapters/domains/plan-subscriptions/controllers/consumer.controller';
import { CreatePlanSubscriptionService } from '@core/domains/plan-subscriptions/services/create-plan-subscription.service';
import { HandlePlanSubscriptionCreatedService } from '@core/domains/plan-subscriptions/services/handle-plan-subscription-created.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseRepositoriesModule],
  controllers: [PlanSubscriptionsConsumerController],
  providers: [CreatePlanSubscriptionService, HandlePlanSubscriptionCreatedService],
})
export class MainModule {}
