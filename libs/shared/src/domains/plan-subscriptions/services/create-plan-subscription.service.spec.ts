import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
import { ValidationException } from '../../../errors/validation-exception';
import { InMemoryEventsService } from '../../../infra/events/implementations/in-memory-events.service';
import { InMemoryUsersDatabaseRepository } from '../../users/repositories/database/implementation/in-memory.repository';
import { InMemoryUsersEventsRepository } from '../../users/repositories/events/implementation/in-memory.repository';
import { CreateUserService } from '../../users/services/create-user.service';
import { InMemoryPlanSubscriptionsDatabaseRepository } from '../repositories/database/implementation/in-memory.repository';
import { InMemoryPlanSubscriptionsEventsRepository } from '../repositories/events/implementation/in-memory.repository';
import { CreatePlanSubscriptionService } from './create-plan-subscription.service';

const setupTests = () => {
  const planSubscriptionsDatabaseRepository =
    new InMemoryPlanSubscriptionsDatabaseRepository();

  const eventsService = new InMemoryEventsService();

  const usersDatabaseRepository = new InMemoryUsersDatabaseRepository();
  const usersEventsRepository = new InMemoryUsersEventsRepository(
    eventsService
  );
  const createUserService = new CreateUserService(
    usersDatabaseRepository,
    usersEventsRepository
  );

  const planSubscriptionsEventsRepository =
    new InMemoryPlanSubscriptionsEventsRepository(
      eventsService,
      createUserService
    );
  const createPlanSubscriptionService = new CreatePlanSubscriptionService(
    planSubscriptionsDatabaseRepository,
    planSubscriptionsEventsRepository
  );
  const create = jest.spyOn(planSubscriptionsDatabaseRepository, 'create');
  const publishPlanSubscriptionCreated = jest.spyOn(
    planSubscriptionsEventsRepository,
    'publishPlanSubscriptionCreated'
  );

  return {
    create,
    publishPlanSubscriptionCreated,
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
    const { createPlanSubscriptionService, publishPlanSubscriptionCreated } =
      setupTests();
    const invalidUserEmail = 'invalid-user-email';
    try {
      await createPlanSubscriptionService.execute({
        email: invalidUserEmail,
        plan: 'default',
      });
      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof ValidationException).toEqual(true);
      expect(publishPlanSubscriptionCreated).not.toHaveBeenCalled();
    }
  });

  it('should create and publish a new plan-subscription', async () => {
    try {
      const {
        createPlanSubscriptionService,
        create,
        publishPlanSubscriptionCreated,
      } = setupTests();

      const createPlanSubscriptionDto = {
        email: faker.internet.email(),
        plan: 'default',
      };

      await createPlanSubscriptionService.execute(createPlanSubscriptionDto);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(createPlanSubscriptionDto);

      expect(publishPlanSubscriptionCreated).toHaveBeenCalledTimes(1);
      expect(publishPlanSubscriptionCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createPlanSubscriptionDto,
          id: expect.any(String),
          isActive: true,
        })
      );
    } catch (error) {
      expect(true).toBe(false);
    }
  });
});
