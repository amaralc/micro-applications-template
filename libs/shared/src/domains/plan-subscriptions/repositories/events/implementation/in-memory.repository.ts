import { Injectable, Logger } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ValidationException } from '../../../../../errors/validation-exception';
import { EventsService } from '../../../../../infra/events/events.service';
import { EachMessageHandler, EachMessagePayload } from '../../../../../infra/events/types';
import { CreateUserService } from '../../../../users/services/create-user.service';
import { PlanSubscriptionCreatedMessageDto } from '../../../entities/plan-subscription-created-message/dto';
import { PlanSubscription } from '../../../entities/plan-subscription.entity';
import { PlanSubscriptionsEventsRepository } from '../events.repository';
import { PLAN_SUBSCRIPTIONS_TOPICS } from '../topics';

const className = 'InMemoryPlanSubscriptionsEventsRepository';
@Injectable()
export class InMemoryPlanSubscriptionsEventsRepository implements PlanSubscriptionsEventsRepository {
  constructor(private eventsService: EventsService, private createUserService: CreateUserService) {}

  async createUserFromPlanSubscriptionCreated({ message }: EachMessagePayload): Promise<void> {
    try {
      // Business logic
      if (!message.value) {
        return;
      }
      const jsonMessage = JSON.parse(message.value.toString());
      const planSubscriptionCreatedMessage = plainToInstance(PlanSubscriptionCreatedMessageDto, jsonMessage);
      Logger.log(JSON.stringify(jsonMessage), className);
      const isValid = await validate(planSubscriptionCreatedMessage);
      if (isValid.length > 0 && isValid.every((item) => item instanceof ValidationError)) {
        throw new ValidationException(isValid, className);
      }

      await this.createUserService.execute({ email: jsonMessage.email });
    } catch (error) {
      if (error instanceof ValidationException) {
        Logger.warn(JSON.stringify(error.causes), error.message);
      }
    }
  }

  async consumePlanSubscriptionCreated(callback: EachMessageHandler): Promise<void> {
    this.eventsService.subscribe(PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'], callback);
  }

  async publishPlanSubscriptionCreated(planSubscription: PlanSubscription): Promise<void> {
    try {
      this.eventsService.publish({
        topic: PLAN_SUBSCRIPTIONS_TOPICS['PLAN_SUBSCRIPTION_CREATED'],
        messages: [
          {
            key: planSubscription.email,
            value: JSON.stringify(instanceToPlain(planSubscription)),
          },
        ],
      });
    } catch (e) {
      Logger.log(e);
    }
  }
}
