import { InvalidTopic } from '../../../errors/invalid-topic-exception';
import { ValidationException } from '../../../errors/validation-exception';
import { makeEachMessagePayloadMock } from '../../../infra/events/tests/factories/each-message-payload.factory';
import { makeKafkaMessageMock } from '../../../infra/events/tests/factories/kafka-message.factory';
import { makePlanSubscriptionCreatedMessage } from '../entities/factories/make-plan-subscription-created-message.factory';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../repositories/events/topics';
import { ParseOrRejectPlanSubscriptionCreatedMessageService } from './parse-or-reject-plan-subscription-created-message.service';

const setupTests = () => {
  const parseOrRejectPlanSubscriptionCreatedMessage =
    new ParseOrRejectPlanSubscriptionCreatedMessageService();
  const execute = jest.spyOn(
    parseOrRejectPlanSubscriptionCreatedMessage,
    'execute'
  );

  return {
    execute,
    parseOrRejectPlanSubscriptionCreatedMessage,
  };
};

describe('[plan-subscriptions] Consume subscription an create user', () => {
  it('should not run for an invalid topic', async () => {
    const { parseOrRejectPlanSubscriptionCreatedMessage } = setupTests();
    const eachMessagePayload = makeEachMessagePayloadMock({
      topic: 'invalid-topic',
    });

    try {
      await parseOrRejectPlanSubscriptionCreatedMessage.execute(
        eachMessagePayload
      );
      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof InvalidTopic).toEqual(true);
    }
  });
  it('should throw validation exception if message payload is not json string', async () => {
    const { parseOrRejectPlanSubscriptionCreatedMessage } = setupTests();

    const eachMessagePayload = makeEachMessagePayloadMock({
      topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
      message: makeKafkaMessageMock({
        value: Buffer.from('invalid-json-string'),
      }),
    });

    try {
      await parseOrRejectPlanSubscriptionCreatedMessage.execute(
        eachMessagePayload
      );
      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof ValidationException).toEqual(true);
    }
  });
  it('should throw validation exception if message payload is json string but not valid', async () => {
    const { parseOrRejectPlanSubscriptionCreatedMessage } = setupTests();

    const eachMessagePayload = makeEachMessagePayloadMock({
      topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
    });

    try {
      await parseOrRejectPlanSubscriptionCreatedMessage.execute(
        eachMessagePayload
      );
      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof ValidationException).toEqual(true);
    }
  });
  it('should return parsed message value if message payload is valid', async () => {
    const { parseOrRejectPlanSubscriptionCreatedMessage } = setupTests();

    const stringMessage = makePlanSubscriptionCreatedMessage({});
    const jsonMessage = JSON.parse(stringMessage);

    const eachMessagePayload = makeEachMessagePayloadMock({
      topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
      message: makeKafkaMessageMock({
        value: Buffer.from(stringMessage),
      }),
    });

    try {
      const returnedJsonMessage =
        await parseOrRejectPlanSubscriptionCreatedMessage.execute(
          eachMessagePayload
        );
      expect(returnedJsonMessage).toEqual(jsonMessage);
    } catch (error) {
      console.log(error);
      expect(true).toEqual(false);
    }
  });
});
