import { InMemoryEventsService } from '../../../infra/events/implementations/in-memory-events.service';
import { InMemoryUsersDatabaseRepository } from '../../users/repositories/database/implementation/in-memory.repository';
import { InMemoryUsersEventsRepository } from '../../users/repositories/events/implementation/in-memory.repository';
import { CreateUserUseCase } from '../../users/use-cases/create-user.use-case';
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
  const createUserUseCase = new CreateUserUseCase(
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
  it('should create and publish a new plan-subscription', async () => {
    const {
      createPlanSubscriptionUseCase,
      create,
      publishPlanSubscriptionCreated,
    } = setupTests();

    await createPlanSubscriptionUseCase.execute({
      email: 'email',
      plan: 'default',
    });
    expect(publishPlanSubscriptionCreated).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
  });
});
