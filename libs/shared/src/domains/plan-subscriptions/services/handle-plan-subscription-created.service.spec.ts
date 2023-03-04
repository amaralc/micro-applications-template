import { makeEachMessagePayloadMock } from '../../../infra/events/tests/factories/each-message-payload.factory';
import { makePlanSubscriptionCreatedMessage } from '../entities/factories/make-plan-subscription-created-message.factory';
import { InMemoryPlanSubscriptionsDatabaseRepository } from '../repositories/database/implementation/in-memory.repository';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../repositories/events/topics';
import { CreatePlanSubscriptionService } from './create-plan-subscription.service';
import { HandlePlanSubscriptionCreatedService } from './handle-plan-subscription-created.service';

const setupTests = () => {
  const planSubscriptionsDatabaseRepository = new InMemoryPlanSubscriptionsDatabaseRepository();
  const createPlanSubscriptionService = new CreatePlanSubscriptionService(planSubscriptionsDatabaseRepository);
  const handlePlanSubscriptionCreatedService = new HandlePlanSubscriptionCreatedService(createPlanSubscriptionService);
  const execute = jest.spyOn(createPlanSubscriptionService, 'execute');

  return {
    handlePlanSubscriptionCreatedService,
    execute,
  };
};

describe('[plan-subscriptions] Consume subscription an create user', () => {
  it('should log validation exception if message payload is not json string', async () => {
    const { handlePlanSubscriptionCreatedService, execute } = setupTests();
    await expect(handlePlanSubscriptionCreatedService.execute('x')).rejects.toThrowError();
    expect(execute).not.toHaveBeenCalled();
  });
  it('should log validation exception if message payload is json string but not valid', async () => {
    const { handlePlanSubscriptionCreatedService, execute } = setupTests();

    const eachMessagePayload = makeEachMessagePayloadMock({
      topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
    });

    await expect(handlePlanSubscriptionCreatedService.execute(eachMessagePayload)).rejects.toThrowError();
    expect(execute).not.toHaveBeenCalled();
  });
  it('should create user if payload is valid', async () => {
    const { handlePlanSubscriptionCreatedService, execute } = setupTests();

    const stringMessage = makePlanSubscriptionCreatedMessage({});
    const jsonMessage = JSON.parse(stringMessage);

    await expect(handlePlanSubscriptionCreatedService.execute(jsonMessage)).resolves.not.toThrow();
    expect(execute).toHaveBeenCalled();
  });
});
