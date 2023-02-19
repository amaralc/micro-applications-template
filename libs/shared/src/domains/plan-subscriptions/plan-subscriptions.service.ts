import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreatePlanSubscriptionDto } from './dto/create-plan-subscription.dto';
import { PlanSubscription } from './entities/plan-subscription.entity';
import { PlanSubscriptionsEventsRepository } from './repositories/events/events.repository';

@Injectable()
export class PlanSubscriptionsService implements OnModuleInit {
  constructor(
    // private planSubscriptionsDatabaseRepository: PlanSubscriptionsDatabaseRepository,
    private planSubscriptionsEventsRepository: PlanSubscriptionsEventsRepository
  ) {}

  create(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    const { email, plan } = createPlanSubscriptionDto;
    this.planSubscriptionsEventsRepository.publishPlanSubscriptionCreated(
      new PlanSubscription(email, plan)
    );
  }

  onModuleInit() {
    Logger.log('Initializing plan subscriptions service consumers...');
    this.planSubscriptionsEventsRepository.consumePlanSubscriptionCreatedAndUpdateUsers();
  }
}
