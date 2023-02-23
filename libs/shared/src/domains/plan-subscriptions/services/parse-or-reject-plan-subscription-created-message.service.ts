import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { InvalidJsonString } from '../../../errors/invalid-json-exception';
import { InvalidTopic } from '../../../errors/invalid-topic-exception';
import { ValidationException } from '../../../errors/validation-exception';
import { EachMessagePayload } from '../../../infra/events/types';
import { PlanSubscriptionCreatedMessageDto } from '../dto/plan-subscription-created-message.dto';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../repositories/events/topics';

const className = 'ParseOrRejectPlanSubscriptionCreatedMessageService';

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

@Injectable()
export class ParseOrRejectPlanSubscriptionCreatedMessageService {
  async execute({
    message,
    topic,
  }: EachMessagePayload): Promise<PlanSubscriptionCreatedMessageDto> {
    // Parse or reject
    if (topic !== PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED']) {
      throw new InvalidTopic();
    }

    if (!message.value) {
      throw new ValidationException(
        [new ValidationError()],
        'No message value'
      );
    }

    const stringMessage = message.value.toString();
    Logger.log('Message value: ' + stringMessage, className);
    if (!isJsonString(stringMessage)) {
      throw new InvalidJsonString();
    }

    const jsonMessage = JSON.parse(message.value.toString());
    const planSubscriptionCreatedMessage = plainToInstance(
      PlanSubscriptionCreatedMessageDto,
      jsonMessage
    );

    await validateOrReject(planSubscriptionCreatedMessage).catch(
      (validationErrors: ValidationError[]) => {
        throw new ValidationException(validationErrors, 'Invalid payload');
      }
    );

    return jsonMessage;
  }
}
