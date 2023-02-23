import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
import { ValidationException } from '../../../errors/validation-exception';
import { InMemoryEventsService } from '../../../infra/events/implementations/in-memory-events.service';
import { InMemoryUsersDatabaseRepository } from '../../users/repositories/database/implementation/in-memory.repository';
import { InMemoryUsersEventsRepository } from '../../users/repositories/events/implementation/in-memory.repository';
import { CreateUserService } from '../../users/use-cases/create-user.use-case';
import { UsersService } from '../../users/users.service';
import { InMemoryPlanSubscriptionsDatabaseRepository } from '../repositories/database/implementation/in-memory.repository';
import { InMemoryPlanSubscriptionsEventsRepository } from '../repositories/events/implementation/in-memory.repository';
import { CreatePlanSubscriptionUseCase } from '../use-cases/create-plan-subscription.use-case';

const setupTests = () => {
  const planSubscriptionsDatabaseRepository =
    new InMemoryPlanSubscriptionsDatabaseRepository();

  const eventsService = new InMemoryEventsService();

  const usersDatabaseRepository = new InMemoryUsersDatabaseRepository();
  const usersEventsRepository = new InMemoryUsersEventsRepository(
    eventsService
  );
  const createUserUseCase = new CreateUserService(
    usersDatabaseRepository,
    usersEventsRepository
  );
  const usersService = new UsersService(createUserUseCase);

  const planSubscriptionsEventsRepository =
    new InMemoryPlanSubscriptionsEventsRepository(eventsService, usersService);
  const createPlanSubscriptionUseCase = new CreatePlanSubscriptionUseCase(
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
    createPlanSubscriptionUseCase,
  };
};

describe('[plan-subscriptions] Create plan subscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw conflict exception if e-mail is already being used', async () => {
    const { createPlanSubscriptionUseCase } = setupTests();
    const newUserEmail = faker.internet.email();
    try {
      await createPlanSubscriptionUseCase.execute({
        email: newUserEmail,
        plan: 'default',
      });
      await createPlanSubscriptionUseCase.execute({
        email: newUserEmail,
        plan: 'default',
      });
      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof ConflictException).toEqual(true);
    }
  });

  it('should throw validation exception if e-mail is not valid', async () => {
    const { createPlanSubscriptionUseCase, publishPlanSubscriptionCreated } =
      setupTests();
    const invalidUserEmail = 'invalid-user-email';
    try {
      await createPlanSubscriptionUseCase.execute({
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
        createPlanSubscriptionUseCase,
        create,
        publishPlanSubscriptionCreated,
      } = setupTests();

      const createPlanSubscriptionDto = {
        email: faker.internet.email(),
        plan: 'default',
      };

      await createPlanSubscriptionUseCase.execute(createPlanSubscriptionDto);
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
