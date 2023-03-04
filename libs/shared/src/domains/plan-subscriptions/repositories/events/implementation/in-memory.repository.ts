import { Injectable, Logger } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { EventsService } from '../../../../../infra/events/events.service';
import { PlanSubscription } from '../../../entities/plan-subscription.entity';
import { PlanSubscriptionsEventsRepository } from '../events.repository';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../topics';

@Injectable()
export class InMemoryPlanSubscriptionsEventsRepository implements PlanSubscriptionsEventsRepository {
  constructor(private eventsService: EventsService) {}

  async publishPlanSubscriptionCreated(planSubscription: PlanSubscription): Promise<void> {
    try {
      this.eventsService.publish({
        topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
        messages: [
          {
            key: planSubscription.email,
            value: JSON.stringify(instanceToPlain(planSubscription)),
          },
        ],
      });
    } catch (e) {
      Logger.log(e, InMemoryPlanSubscriptionsEventsRepository.name);
    }
  }
}
