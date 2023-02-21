import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { InvalidJsonString } from '../../../errors/invalid-json-exception';
import { ValidationException } from '../../../errors/validation-exception';
import { EachMessagePayload } from '../../../infra/events/types';
import { CreateUserUseCase } from '../../users/use-cases/create-user.use-case';
import { PlanSubscriptionCreatedMessageDto } from '../dto/plan-subscription-created-message.dto';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../repositories/events/topics';

const className = 'CreateUserFromPlanSubscriptionCreatedUseCase';

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

@Injectable()
export class CreateUserFromPlanSubscriptionCreatedUseCase {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async execute({ message, topic }: EachMessagePayload): Promise<void> {
    // Validate or reject
    if (topic !== PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED']) {
      return;
    }

    if (!message.value) {
      throw new ValidationException(
        [new ValidationError()],
        'No message value'
      );
    }

    const stringMessage = message.value.toString();
    if (!isJsonString(stringMessage)) {
      throw new InvalidJsonString();
    }

    const jsonMessage = JSON.parse(message.value.toString());
    Logger.log(JSON.stringify(jsonMessage), className);
    const planSubscriptionCreatedMessage = plainToInstance(
      PlanSubscriptionCreatedMessageDto,
      jsonMessage
    );

    await validateOrReject(planSubscriptionCreatedMessage).catch(
      (validationErrors: ValidationError[]) => {
        throw new ValidationException(validationErrors, 'Invalid payload');
      }
    );

    // Execute
    await this.createUserUseCase.execute({ email: jsonMessage.email });
  }
}
