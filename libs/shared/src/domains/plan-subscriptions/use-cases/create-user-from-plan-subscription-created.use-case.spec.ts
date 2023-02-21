import { ValidationException } from '../../../errors/validation-exception';
import { InMemoryEventsService } from '../../../infra/events/implementations/in-memory-events.service';
import { makeEachMessagePayloadMock } from '../../../infra/events/tests/factories/each-message-payload.factory';
import { makeKafkaMessageMock } from '../../../infra/events/tests/factories/kafka-message.factory';
import { InMemoryUsersDatabaseRepository } from '../../users/repositories/database/implementation/in-memory.repository';
import { InMemoryUsersEventsRepository } from '../../users/repositories/events/implementation/in-memory.repository';
import { CreateUserUseCase } from '../../users/use-cases/create-user.use-case';
import { makePlanSubscriptionCreatedMessage } from '../entities/factories/make-plan-subscription-created-message.factory';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../repositories/events/topics';
import { CreateUserFromPlanSubscriptionCreatedUseCase } from '../use-cases/create-user-from-plan-subscription-created.use-case';

const setupTests = () => {
  const eventsService = new InMemoryEventsService();
  const usersEventsRepository = new InMemoryUsersEventsRepository(
    eventsService
  );
  const usersDatabaseRepository = new InMemoryUsersDatabaseRepository();
  const createUserUseCase = new CreateUserUseCase(
    usersDatabaseRepository,
    usersEventsRepository
  );
  const createUserFromPlanSubscriptionUseCase =
    new CreateUserFromPlanSubscriptionCreatedUseCase(createUserUseCase);
  const execute = jest.spyOn(createUserUseCase, 'execute');

  return {
    execute,
    createUserFromPlanSubscriptionUseCase,
  };
};

describe('[plan-subscriptions] Consume subscription an create user', () => {
  it('should not run for an invalid topic', async () => {
    const { createUserFromPlanSubscriptionUseCase, execute } = setupTests();
    const eachMessagePayload = makeEachMessagePayloadMock({
      topic: 'invalid-topic',
    });

    try {
      await createUserFromPlanSubscriptionUseCase.execute(eachMessagePayload);
      expect(execute).not.toHaveBeenCalled();
    } catch {
      expect(true).toEqual(false);
    }
  });
  it('should throw validation exception if message payload is not json string', async () => {
    const { createUserFromPlanSubscriptionUseCase, execute } = setupTests();

    const eachMessagePayload = makeEachMessagePayloadMock({
      topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
      message: makeKafkaMessageMock({
        value: Buffer.from('invalid-json-string'),
      }),
    });

    try {
      await createUserFromPlanSubscriptionUseCase.execute(eachMessagePayload);
      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof ValidationException).toEqual(true);
      expect(execute).not.toHaveBeenCalled();
    }
  });

  it('should throw validation exception if message payload is json string but not valid', async () => {
    const { createUserFromPlanSubscriptionUseCase, execute } = setupTests();

    const eachMessagePayload = makeEachMessagePayloadMock({
      topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
    });

    try {
      await createUserFromPlanSubscriptionUseCase.execute(eachMessagePayload);
      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof ValidationException).toEqual(true);
      expect(execute).not.toHaveBeenCalled();
    }
  });

  it('should call create user if message payload is valid', async () => {
    const { createUserFromPlanSubscriptionUseCase, execute } = setupTests();

    const eachMessagePayload = makeEachMessagePayloadMock({
      topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
      message: makeKafkaMessageMock({
        value: Buffer.from(makePlanSubscriptionCreatedMessage({})),
      }),
    });

    try {
      await createUserFromPlanSubscriptionUseCase.execute(eachMessagePayload);
      expect(execute).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(true).toEqual(false);
    }
  });
});
