import {
  MongoosePlanSubscription,
  MongoosePlanSubscriptionSchema,
} from '@core/domains/plan-subscriptions/entities/plan-subscription.entity';
import {
  PlanSubscriptionsDatabaseRepository,
  PlanSubscriptionsDatabaseRepositoryImplementation,
} from '@core/domains/plan-subscriptions/repositories/database/database.repository';
import {
  PlanSubscriptionsEventsRepository,
  PlanSubscriptionsEventsRepositoryImplementation,
} from '@core/domains/plan-subscriptions/repositories/events/events.repository';
import { CreatePlanSubscriptionService } from '@core/domains/plan-subscriptions/services/create-plan-subscription.service';
import { HandlePlanSubscriptionCreatedService } from '@core/domains/plan-subscriptions/services/handle-plan-subscription-created.service';
import { MongooseUser, MongooseUserSchema } from '@core/domains/users/entities/user.entity';
import {
  UsersDatabaseRepository,
  UsersDatabaseRepositoryImplementation,
} from '@core/domains/users/repositories/database/database.repository';
import {
  UsersEventsRepository,
  UsersEventsRepositoryImplementation,
} from '@core/domains/users/repositories/events/events.repository';
import { CreateUserService } from '@core/domains/users/services/create-user.service';
import { InfraModule } from '@infra/infra.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaPlanSubscriptionConsumerController } from './plan-subscription-consumer.controller';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    InfraModule,
    MongooseModule.forFeature([
      {
        name: MongooseUser.name,
        schema: MongooseUserSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: MongoosePlanSubscription.name,
        schema: MongoosePlanSubscriptionSchema,
      },
    ]),
  ],
  controllers: [KafkaPlanSubscriptionConsumerController],
  providers: [
    CreateUserService,
    CreatePlanSubscriptionService,
    HandlePlanSubscriptionCreatedService,
    {
      provide: PlanSubscriptionsDatabaseRepository,
      useClass: PlanSubscriptionsDatabaseRepositoryImplementation,
    },
    {
      provide: PlanSubscriptionsEventsRepository,
      useClass: PlanSubscriptionsEventsRepositoryImplementation,
    },
    {
      provide: UsersDatabaseRepository,
      useClass: UsersDatabaseRepositoryImplementation,
    },
    {
      provide: UsersEventsRepository,
      useClass: UsersEventsRepositoryImplementation,
    },
  ],
})
export class PlanSubscriptionConsumerModule {}
