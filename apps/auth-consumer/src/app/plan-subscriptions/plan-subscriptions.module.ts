import {
  PlanSubscriptionsDatabaseRepository,
  PlanSubscriptionsDatabaseRepositoryImplementation,
} from '@auth/shared/domains/plan-subscriptions/repositories/database/plan-subscriptions-database.repository';
import {
  PlanSubscriptionsEventsRepository,
  PlanSubscriptionsEventsRepositoryImplementation,
} from '@auth/shared/domains/plan-subscriptions/repositories/events/plan-subscriptions-events.repository';
import {
  UsersDatabaseRepository,
  UsersDatabaseRepositoryImplementation,
} from '@auth/shared/domains/users/repositories/database/users-database.repository';
import { InfraModule } from '@auth/shared/infra/infra.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlanSubscriptionsController } from './plan-subscriptions.controller';
import { PlanSubscriptionsService } from './plan-subscriptions.service';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    InfraModule,
  ],
  controllers: [PlanSubscriptionsController],
  providers: [
    PlanSubscriptionsService,
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
  ],
})
export class PlanSubscriptionsModule {}
