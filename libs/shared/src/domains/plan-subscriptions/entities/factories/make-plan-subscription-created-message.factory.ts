import { faker } from '@faker-js/faker';
import {
  IPlanSubscriptionProps,
  PlanSubscription,
} from '../plan-subscription.entity';

type Override = Partial<IPlanSubscriptionProps>;

export function makePlanSubscriptionCreatedMessage(override: Override) {
  const newPlanSubscription = new PlanSubscription({
    email: faker.internet.email(),
    plan: 'default',
    ...override,
  });

  return JSON.stringify(newPlanSubscription);
}
