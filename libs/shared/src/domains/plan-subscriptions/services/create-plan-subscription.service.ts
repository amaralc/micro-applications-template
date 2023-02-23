import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { ValidationException } from '../../../errors/validation-exception';
import { CreatePlanSubscriptionDto } from '../dto/create-plan-subscription.dto';
import { PLAN_SUBSCRIPTIONS_ERROR_MESSAGES } from '../errors/error-messages';
import { PlanSubscriptionsDatabaseRepository } from '../repositories/database/database.repository';
import { PlanSubscriptionsEventsRepository } from '../repositories/events/events.repository';

const className = 'CreatePlanSubscriptionService';
@Injectable()
export class CreatePlanSubscriptionService {
  constructor(
    private readonly planSubscriptionsDatabaseRepository: PlanSubscriptionsDatabaseRepository,
    private readonly planSubscriptionsEventsRepository: PlanSubscriptionsEventsRepository
  ) {}

  async execute(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    // Validate or reject
    try {
      const createPlanSubscriptionDtoInstance = plainToInstance(
        CreatePlanSubscriptionDto,
        createPlanSubscriptionDto
      );
      await validateOrReject(createPlanSubscriptionDtoInstance);
    } catch (errors) {
      if (
        Array.isArray(errors) &&
        errors.every((error) => error instanceof ValidationError)
      ) {
        throw new ValidationException(
          errors,
          PLAN_SUBSCRIPTIONS_ERROR_MESSAGES['VALIDATION']['INVALID_EMAIL']
        );
      }

      throw errors;
    }

    // Execute
    const planSubscription =
      await this.planSubscriptionsDatabaseRepository.create(
        createPlanSubscriptionDto
      );
    Logger.log(
      'Plan subscription stored: ' + JSON.stringify(planSubscription),
      className
    );

    await this.planSubscriptionsEventsRepository.publishPlanSubscriptionCreated(
      planSubscription
    );

    return { planSubscription };
  }
}
