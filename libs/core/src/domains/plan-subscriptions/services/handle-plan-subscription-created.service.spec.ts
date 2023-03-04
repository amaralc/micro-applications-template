import { faker } from '@faker-js/faker';
import { makeEachMessagePayloadMock } from '@infra/events/tests/factories/each-message-payload.factory';
import { PlanSubscriptionCreatedMessageEntity } from '../entities/plan-subscription-created-message/entity';
import { InMemoryPlanSubscriptionsDatabaseRepository } from '../repositories/database-in-memory.repository';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../topics';
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

describe('[plan-subscriptions] Handle plan subscription created', () => {
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
  it('should create plan subscription if payload is valid', async () => {
    const { handlePlanSubscriptionCreatedService, execute } = setupTests();

    const entity = new PlanSubscriptionCreatedMessageEntity({
      email: faker.internet.email(),
      plan: faker.lorem.slug(1),
    });
    const jsonMessage = JSON.parse(JSON.stringify(entity));

    await expect(handlePlanSubscriptionCreatedService.execute(jsonMessage)).resolves.not.toThrow();
    expect(execute).toHaveBeenCalled();
  });
});
