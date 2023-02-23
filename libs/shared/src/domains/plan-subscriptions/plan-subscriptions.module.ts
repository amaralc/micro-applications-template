import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InfraModule } from '../../infra/infra.module';
import { UsersModule } from '../users/users.module';
import {
  MongoosePlanSubscription,
  MongoosePlanSubscriptionSchema,
} from './entities/plan-subscription.entity';
import { PlanSubscriptionsConsumer } from './plan-subscriptions.consumer';
import { PlanSubscriptionsController } from './plan-subscriptions.controller';
import {
  PlanSubscriptionsDatabaseRepository,
  PlanSubscriptionsDatabaseRepositoryImplementation,
} from './repositories/database/database.repository';
import {
  PlanSubscriptionsEventsRepository,
  PlanSubscriptionsEventsRepositoryImplementation,
} from './repositories/events/events.repository';
import { ConsumePlanSubscriptionCreatedService } from './services/consume-plan-subscription-created.service';
import { CreatePlanSubscriptionService } from './services/create-plan-subscription.service';
import { ParseOrRejectPlanSubscriptionCreatedMessageService } from './services/parse-or-reject-plan-subscription-created-message.service';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    InfraModule,
    UsersModule,
    MongooseModule.forFeature([
      {
        name: MongoosePlanSubscription.name,
        schema: MongoosePlanSubscriptionSchema,
      },
    ]),
  ],
  controllers: [PlanSubscriptionsController],
  providers: [
    PlanSubscriptionsConsumer,
    ConsumePlanSubscriptionCreatedService,
    CreatePlanSubscriptionService,
    ParseOrRejectPlanSubscriptionCreatedMessageService,
    {
      provide: PlanSubscriptionsDatabaseRepository,
      useClass: PlanSubscriptionsDatabaseRepositoryImplementation,
    },
    {
      provide: PlanSubscriptionsEventsRepository,
      useClass: PlanSubscriptionsEventsRepositoryImplementation,
    },
  ],
  exports: [],
})
export class PlanSubscriptionsModule {}
