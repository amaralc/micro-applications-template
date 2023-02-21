import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import {
  CreatePlanSubscriptionDto,
  ICreatePlanSubscriptionDtoProps,
} from '../../dto/create-plan-subscription.dto';

type Override = Partial<ICreatePlanSubscriptionDtoProps>;

export function makePlanSubscriptionCreatedMessage(override: Override) {
  const createPlanSubscriptionDto = new CreatePlanSubscriptionDto({
    id: randomUUID(),
    isActive: true,
    email: faker.internet.email(),
    plan: 'default',
    ...override,
  });

  return JSON.stringify(createPlanSubscriptionDto);
}
