import { CreatePlanSubscriptionDto } from '@auth/shared/domains/dto/create-plan-subscription.dto';
import { PlanSubscription } from '@auth/shared/domains/entities/plan-subscription.entity';
import { PlanSubscriptionsDatabaseRepository } from '@auth/shared/domains/plan-subscriptions/repositories/database/plan-subscriptions-database.repository';
import { PlanSubscriptionsEventsRepository } from '@auth/shared/domains/plan-subscriptions/repositories/events/plan-subscriptions-events.repository';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PlanSubscriptionsService implements OnModuleInit {
  constructor(
    private planSubscriptionsDatabaseRepository: PlanSubscriptionsDatabaseRepository,
    private planSubscriptionsEventsRepository: PlanSubscriptionsEventsRepository
  ) {}

  create(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    const { email, plan } = createPlanSubscriptionDto;
    this.planSubscriptionsEventsRepository.publishPlanSubscriptionCreated(
      new PlanSubscription(email, plan)
    );
  }

  onModuleInit() {
    Logger.log('Initializing planSubscriptions service...');
    this.planSubscriptionsEventsRepository.consumePlanSubscriptionCreatedAndUpdateUsers();
  }
}
