import { InMemoryEventsService } from '../../../infra/events/implementations/in-memory-events.service';
import { Message } from '../../../infra/events/types';
import { InMemoryUsersDatabaseRepository } from '../../users/repositories/database/implementation/in-memory.repository';
import { InMemoryUsersEventsRepository } from '../../users/repositories/events/implementation/in-memory.repository';
import { CreateUserService } from '../../users/services/create-user.service';
import { InMemoryPlanSubscriptionsEventsRepository } from '../repositories/events/implementation/in-memory.repository';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../repositories/events/topics';
import { ConsumePlanSubscriptionCreatedService } from './consume-plan-subscription-created.service';

const setupTests = () => {
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
  const consumePlanSubscriptionCreatedService =
    new ConsumePlanSubscriptionCreatedService(
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
    consumePlanSubscriptionCreatedService,
  };
};

describe('[plan-subscriptions] Consume subscription an create user', () => {
  it('should consume plan-subscription-created', async () => {
    const {
      eventsService,
      subscribe,
      consumePlanSubscriptionCreatedService,
      callback,
    } = setupTests();

    await consumePlanSubscriptionCreatedService.execute(callback);

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
