import { InMemoryEventsService } from '../../../infra/events/implementations/in-memory-events.service';
import { makeEachMessagePayloadMock } from '../../../infra/events/tests/factories/each-message-payload.factory';
import { InMemoryUsersDatabaseRepository } from '../../users/repositories/database/implementation/in-memory.repository';
import { InMemoryUsersEventsRepository } from '../../users/repositories/events/implementation/in-memory.repository';
import { CreateUserService } from '../../users/services/create-user.service';
import { makePlanSubscriptionCreatedMessage } from '../entities/factories/make-plan-subscription-created-message.factory';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../repositories/events/topics';
import { HandlePlanSubscriptionCreatedService } from './handle-plan-subscription-created.service';

const setupTests = () => {
  const eventsService = new InMemoryEventsService();
  const usersEventsRepository = new InMemoryUsersEventsRepository(
    eventsService
  );
  const usersDatabaseRepository = new InMemoryUsersDatabaseRepository();
  const createUserService = new CreateUserService(
    usersDatabaseRepository,
    usersEventsRepository
  );
  const handlePlanSubscriptionCreatedService =
    new HandlePlanSubscriptionCreatedService(createUserService);

  const execute = jest.spyOn(createUserService, 'execute');
  const warn = jest.spyOn(handlePlanSubscriptionCreatedService.logger, 'warn');

  return {
    handlePlanSubscriptionCreatedService,
    execute,
    warn,
  };
};

describe('[plan-subscriptions] Consume subscription an create user', () => {
  it('should log validation exception if message payload is not json string', async () => {
    const { handlePlanSubscriptionCreatedService, execute, warn } =
      setupTests();
    await expect(
      handlePlanSubscriptionCreatedService.execute('x')
    ).resolves.toBeUndefined();
    expect(execute).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
  });
  it('should log validation exception if message payload is json string but not valid', async () => {
    const { handlePlanSubscriptionCreatedService, execute, warn } =
      setupTests();

    const eachMessagePayload = makeEachMessagePayloadMock({
      topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
    });

    await expect(
      handlePlanSubscriptionCreatedService.execute(eachMessagePayload)
    ).resolves.toBeUndefined();
    expect(execute).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
  });
  it('should create user if payload is valid', async () => {
    const { handlePlanSubscriptionCreatedService, execute } = setupTests();

    const stringMessage = makePlanSubscriptionCreatedMessage({});
    const jsonMessage = JSON.parse(stringMessage);

    await expect(
      handlePlanSubscriptionCreatedService.execute(jsonMessage)
    ).resolves.not.toThrow();
    expect(execute).toHaveBeenCalled();
  });
});
