import { DatabaseRepositoriesModule } from '@adapters/repositories/database/database-repositories.module';
import { HandlePlanSubscriptionCreatedService } from '@core/domains/plan-subscriptions/handlers/handle-plan-subscription-created.service';
import { CreatePlanSubscriptionService } from '@core/domains/plan-subscriptions/services/create-plan-subscription.service';
import { ApplicationLogger } from '@core/shared/logs/application-logger';
import { NativeLogger } from '@core/shared/logs/native-logger';
import { Module } from '@nestjs/common';
import { PlanSubscriptionsConsumerController } from './controllers/plan-subscriptions.controller';

@Module({
  imports: [DatabaseRepositoriesModule],
  controllers: [PlanSubscriptionsConsumerController],
  providers: [
    { provide: ApplicationLogger, useClass: NativeLogger },
    CreatePlanSubscriptionService,
    HandlePlanSubscriptionCreatedService,
  ],
})
export class MainModule {}
