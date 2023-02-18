import { Injectable } from '@nestjs/common';
import { EventsService } from '../../../../../infra/events/events.service';
import { PlanSubscription } from '../../../../entities/plan-subscription.entity';
import { UsersDatabaseRepository } from '../../../../users/repositories/database/users-database.repository';
import { PlanSubscriptionsEventsRepository } from '../plan-subscriptions-events.repository';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../topics';

@Injectable()
export class InMemoryPlanSubscriptionsEventsRepository
  implements PlanSubscriptionsEventsRepository
{
  constructor(
    private eventsService: EventsService,
    private usersDatabaseRepository: UsersDatabaseRepository
  ) {}

  async consumePlanSubscriptionCreatedAndUpdateUsers(): Promise<void> {
    this.eventsService.subscribe(
      'plan-subscription-created',
      async ({ message }) => {
        // Business logic
        if (!message.value) {
          return;
        }
        const jsonMessage = JSON.parse(message.value.toString());
        console.log('message consumed', jsonMessage);
        this.usersDatabaseRepository.create({ email: jsonMessage.email });
      }
    );
  }

  async publishPlanSubscriptionCreated(
    planSubscription: PlanSubscription
  ): Promise<void> {
    this.eventsService.publish({
      topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
      messages: [
        {
          key: planSubscription.email,
          value: JSON.stringify({
            email: planSubscription.email,
            id: planSubscription.id,
          }),
        },
      ],
    });
  }
}
