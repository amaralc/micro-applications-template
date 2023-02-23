import { faker } from '@faker-js/faker';
import {
  IMakePlanSubscriptionProps,
  PlanSubscription,
} from '../plan-subscription.entity';

type Override = Partial<IMakePlanSubscriptionProps>;

export function makePlanSubscriptionCreatedMessage(override: Override) {
  const newPlanSubscription = new PlanSubscription({
    email: faker.internet.email(),
    plan: 'default',
    ...override,
  });

  return JSON.stringify(newPlanSubscription);
}
