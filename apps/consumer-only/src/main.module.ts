import { PlanSubscriptionsConsumerController } from '@adapters/domains/plan-subscriptions/controllers/consumer.controller';
import { PlanSubscriptionsModule } from '@adapters/domains/plan-subscriptions/plan-subscriptions.module';
import { CreatePlanSubscriptionService } from '@core/domains/plan-subscriptions/services/create-plan-subscription.service';
import { HandlePlanSubscriptionCreatedService } from '@core/domains/plan-subscriptions/services/handle-plan-subscription-created.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PlanSubscriptionsModule],
  controllers: [PlanSubscriptionsConsumerController],
  providers: [CreatePlanSubscriptionService, HandlePlanSubscriptionCreatedService],
})
export class MainModule {}
