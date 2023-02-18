// users.repository.ts
import { Injectable } from '@nestjs/common';
import { KafkaEventsService } from '../../../../../infra/events/implementations/kafka.service';
import { PlanSubscription } from '../../../../entities/plan-subscription.entity';
import { PlanSubscriptionsEventsRepository } from '../plan-subscriptions-events.repository';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../topics';

@Injectable()
export class KafkaPlanSubscriptionsEventsRepository
  implements PlanSubscriptionsEventsRepository
{
  constructor(private kafkaEventsService: KafkaEventsService) {}

  async consumePlanSubscriptionCreatedAndUpdateUsers(): Promise<void> {
    this.kafkaEventsService.subscribe(
      'plan-subscription-created',
      async ({ message }) => {
        // Business logic
        if (!message.value) {
          return;
        }
        const jsonMessage = JSON.parse(message.value.toString());
        console.log('message consumed', jsonMessage);
        // this.usersDatabaseRepository.create({ email: jsonMessage.email });
      }
    );
  }

  async publishPlanSubscriptionCreated(
    planSubscription: PlanSubscription
  ): Promise<void> {
    this.kafkaEventsService.publish({
      topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
      messages: [
        {
          value: JSON.stringify({
            id: planSubscription.id,
            email: planSubscription.email,
            plan: planSubscription.plan,
          }),
        },
      ],
    });
  }
}
