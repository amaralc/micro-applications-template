import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
import { ValidationException } from '../../../errors/validation-exception';
import { InMemoryPlanSubscriptionsDatabaseRepository } from '../repositories/database-in-memory.repository';
import { CreatePlanSubscriptionService } from './create-plan-subscription.service';

const setupTests = () => {
  const planSubscriptionsDatabaseRepository = new InMemoryPlanSubscriptionsDatabaseRepository();
  const createPlanSubscriptionService = new CreatePlanSubscriptionService(planSubscriptionsDatabaseRepository);
  const create = jest.spyOn(planSubscriptionsDatabaseRepository, 'create');

  return {
    create,
    createPlanSubscriptionService,
  };
};

describe('[plan-subscriptions] Create plan subscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw conflict exception if e-mail is already being used', async () => {
    const { createPlanSubscriptionService } = setupTests();
    const newUserEmail = faker.internet.email();
    try {
      await createPlanSubscriptionService.execute({
        email: newUserEmail,
        plan: 'default',
      });
      await createPlanSubscriptionService.execute({
        email: newUserEmail,
        plan: 'default',
      });
      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof ConflictException).toEqual(true);
    }
  });

  it('should throw validation exception if e-mail is not valid', async () => {
    const { createPlanSubscriptionService } = setupTests();
    const invalidUserEmail = 'invalid-user-email';
    try {
      await createPlanSubscriptionService.execute({
        email: invalidUserEmail,
        plan: 'default',
      });
      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof ValidationException).toEqual(true);
    }
  });

  it('should create a new plan-subscription', async () => {
    try {
      const { createPlanSubscriptionService, create } = setupTests();

      const createPlanSubscriptionDto = {
        email: faker.internet.email(),
        plan: 'default',
      };

      await createPlanSubscriptionService.execute(createPlanSubscriptionDto);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(createPlanSubscriptionDto);
    } catch (error) {
      expect(true).toBe(false);
    }
  });
});
