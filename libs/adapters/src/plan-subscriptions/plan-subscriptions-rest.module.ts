import { PlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database.repository';
import { CreatePlanSubscriptionService } from '@core/domains/plan-subscriptions/services/create-plan-subscription.service';
import { ListPaginatedPlanSubscriptionsService } from '@core/domains/plan-subscriptions/services/list-paginated-plan-subscriptions.service';
import { UsersDatabaseRepository } from '@core/domains/users/repositories/database.repository';
import { UsersEventsRepository } from '@core/domains/users/repositories/events.repository';
import { CreateUserService } from '@core/domains/users/services/create-user.service';
import { InfraModule } from '@infra/infra.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersDatabaseRepositoryImplementation } from '../users/repositories/database';
import { MongooseUser } from '../users/repositories/database/mongoose-mongodb.entity';
import { UsersEventsRepositoryImplementation } from '../users/repositories/events';
import { PlanSubscriptionsRestController } from './plan-subscriptions-rest.controller';
import { PlanSubscriptionsDatabaseRepositoryImplementation } from './repositories/database';
import { MongoosePlanSubscription, MongooseUserSchema } from './repositories/database/mongoose-mongodb.entity';

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
        schema: MongoosePlanSubscription,
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
  ],
  exports: [],
})
export class PlanSubscriptionsRestModule {}
