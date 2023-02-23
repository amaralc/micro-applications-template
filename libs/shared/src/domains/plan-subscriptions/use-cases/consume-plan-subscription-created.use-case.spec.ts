import { InMemoryEventsService } from '../../../infra/events/implementations/in-memory-events.service';
import { Message } from '../../../infra/events/types';
import { InMemoryUsersDatabaseRepository } from '../../users/repositories/database/implementation/in-memory.repository';
import { InMemoryUsersEventsRepository } from '../../users/repositories/events/implementation/in-memory.repository';
import { CreateUserService } from '../../users/use-cases/create-user.use-case';
import { UsersService } from '../../users/users.service';
import { InMemoryPlanSubscriptionsEventsRepository } from '../repositories/events/implementation/in-memory.repository';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../repositories/events/topics';
import { ConsumePlanSubscriptionCreatedUseCase } from './consume-plan-subscription-created.use-case';

const setupTests = () => {
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
  const consumePlanSubscriptionCreatedUseCase =
    new ConsumePlanSubscriptionCreatedUseCase(
      planSubscriptionsEventsRepository
    );

  const subscribe = jest.spyOn(eventsService, 'subscribe');

  const shouldFailIfThisFunctionIsExecuted = () => {
    expect(true).toEqual(false);
  };

  const callback = jest.fn(() => Promise.resolve());

  return {
    shouldFailIfThisFunctionIsExecuted,
    callback,
    eventsService,
    subscribe,
    consumePlanSubscriptionCreatedUseCase,
  };
};

describe('[plan-subscriptions] Consume subscription an create user', () => {
  it('should consume plan-subscription-created', async () => {
    const {
      eventsService,
      subscribe,
      consumePlanSubscriptionCreatedUseCase,
      callback,
    } = setupTests();

    await consumePlanSubscriptionCreatedUseCase.execute(callback);

    const topic = PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'];
    const messages: Array<Message> = [];

    await eventsService.publish({
      topic,
      messages,
    });

    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(topic, callback);
  });
});
