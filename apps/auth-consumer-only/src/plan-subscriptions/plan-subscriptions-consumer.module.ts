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
import { ConsumePlanSubscriptionCreatedService } from '@auth/shared/domains/plan-subscriptions/services/consume-plan-subscription-created.service';
import { ParseOrRejectPlanSubscriptionCreatedMessageService } from '@auth/shared/domains/plan-subscriptions/services/parse-or-reject-plan-subscription-created-message.service';
import {
  MongooseUser,
  MongooseUserSchema,
} from '@auth/shared/domains/users/entities/user.entity';
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
  controllers: [],
  providers: [
    ConsumePlanSubscriptionCreatedService,
    ParseOrRejectPlanSubscriptionCreatedMessageService,
    CreateUserService,
    {
      provide: UsersDatabaseRepository,
      useClass: UsersDatabaseRepositoryImplementation,
    },
    {
      provide: UsersEventsRepository,
      useClass: UsersEventsRepositoryImplementation,
    },
    {
      provide: PlanSubscriptionsDatabaseRepository,
      useClass: PlanSubscriptionsDatabaseRepositoryImplementation,
    },
    {
      provide: PlanSubscriptionsEventsRepository,
      useClass: PlanSubscriptionsEventsRepositoryImplementation,
    },
  ],
})
export class PlainSubscriptionsConsumerModule {}
