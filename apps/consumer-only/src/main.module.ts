import {
  MongoosePlanSubscription,
  MongoosePlanSubscriptionSchema,
} from '@auth/shared/domains/plan-subscriptions/entities/plan-subscription.entity';
import {
  PlanSubscriptionsDatabaseRepository,
  PlanSubscriptionsDatabaseRepositoryImplementation,
} from '@auth/shared/domains/plan-subscriptions/repositories/database/database.repository';
import {
  PlanSubscriptionsEventsRepository,
  PlanSubscriptionsEventsRepositoryImplementation,
} from '@auth/shared/domains/plan-subscriptions/repositories/events/events.repository';
import { CreatePlanSubscriptionService } from '@auth/shared/domains/plan-subscriptions/services/create-plan-subscription.service';
import { HandlePlanSubscriptionCreatedService } from '@auth/shared/domains/plan-subscriptions/services/handle-plan-subscription-created.service';
import { MongooseUser, MongooseUserSchema } from '@auth/shared/domains/users/entities/user.entity';
import {
  UsersDatabaseRepository,
  UsersDatabaseRepositoryImplementation,
} from '@auth/shared/domains/users/repositories/database/database.repository';
import {
  UsersEventsRepository,
  UsersEventsRepositoryImplementation,
} from '@auth/shared/domains/users/repositories/events/events.repository';
import { CreateUserService } from '@auth/shared/domains/users/services/create-user.service';
import { InfraModule } from '@auth/shared/infra/infra.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaPlanSubscriptionConsumerController } from './main.controller';

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
export class MainModule {}
