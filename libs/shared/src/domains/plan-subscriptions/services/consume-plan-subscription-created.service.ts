import { Injectable, Logger } from '@nestjs/common';
import { EachMessageHandler } from '../../../infra/events/types';
import { PlanSubscriptionsEventsRepository } from '../repositories/events/events.repository';

const className = 'ConsumePlanSubscriptionCreatedService';

@Injectable()
export class ConsumePlanSubscriptionCreatedService {
  constructor(
    private planSubscriptionsEventsRepository: PlanSubscriptionsEventsRepository
  ) {}

  async execute(callback: EachMessageHandler): Promise<void> {
    // Execute
    Logger.log(
      'Initializing plan subscriptions service consumers...',
      className
    );
    this.planSubscriptionsEventsRepository.consumePlanSubscriptionCreated(
      callback
    );
  }
}
