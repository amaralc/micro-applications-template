import { DatabaseRepositoriesModule } from '@adapters/repositories/database/database-repositories.module';
import { CreatePlanSubscriptionService } from '@core/domains/plan-subscriptions/services/create-plan-subscription.service';
import { HandlePlanSubscriptionCreatedService } from '@core/domains/plan-subscriptions/services/handle-plan-subscription-created.service';
import { Module } from '@nestjs/common';
import { PlanSubscriptionsConsumerController } from './controllers/plan-subscriptions.controller';

@Module({
  imports: [DatabaseRepositoriesModule],
  controllers: [PlanSubscriptionsConsumerController],
  providers: [CreatePlanSubscriptionService, HandlePlanSubscriptionCreatedService],
})
export class MainModule {}
