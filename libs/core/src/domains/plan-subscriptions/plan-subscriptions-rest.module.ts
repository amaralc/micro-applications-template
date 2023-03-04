import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InfraModule } from '../../infra/infra.module';
import { MongooseUser, MongooseUserSchema } from '../users/entities/user.entity';
import {
  UsersDatabaseRepository,
  UsersDatabaseRepositoryImplementation,
} from '../users/repositories/database/database.repository';
import {
  UsersEventsRepository,
  UsersEventsRepositoryImplementation,
} from '../users/repositories/events/events.repository';
import { CreateUserService } from '../users/services/create-user.service';
import { MongoosePlanSubscription, MongoosePlanSubscriptionSchema } from './entities/plan-subscription.entity';
import { PlanSubscriptionsRestController } from './plan-subscriptions-rest.controller';
import {
  PlanSubscriptionsDatabaseRepository,
  PlanSubscriptionsDatabaseRepositoryImplementation,
} from './repositories/database/database.repository';
import {
  PlanSubscriptionsEventsRepository,
  PlanSubscriptionsEventsRepositoryImplementation,
} from './repositories/events/events.repository';
import { CreatePlanSubscriptionService } from './services/create-plan-subscription.service';
import { ListPaginatedPlanSubscriptionsService } from './services/list-paginated-plan-subscriptions.service';

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
        name: MongoosePlanSubscription.name,
        schema: MongoosePlanSubscriptionSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: MongooseUser.name,
        schema: MongooseUserSchema,
      },
    ]),
  ],
  controllers: [PlanSubscriptionsRestController],
  providers: [
    ListPaginatedPlanSubscriptionsService,
    CreatePlanSubscriptionService,
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
  exports: [],
})
export class PlanSubscriptionsRestModule {}
