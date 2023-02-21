import { Injectable, OnModuleInit } from '@nestjs/common';
import { PlanSubscriptionsService } from './plan-subscriptions.service';

@Injectable()
export class PlanSubscriptionsConsumer implements OnModuleInit {
  constructor(private planSubscriptionsService: PlanSubscriptionsService) {}

  onModuleInit() {
    this.planSubscriptionsService.consumePlanSubscriptionCreatedAndCreateUsers();
  }
}
