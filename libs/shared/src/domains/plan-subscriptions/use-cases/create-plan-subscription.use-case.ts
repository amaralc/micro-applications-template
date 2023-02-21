import { Injectable, ValidationError } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { ValidationException } from '../../../errors/validation-exception';
import { CreatePlanSubscriptionDto } from '../dto/create-plan-subscription.dto';
import { PLAN_SUBSCRIPTIONS_ERROR_MESSAGES } from '../errors/error-messages';
import { PlanSubscriptionsDatabaseRepository } from '../repositories/database/database.repository';
import { PlanSubscriptionsEventsRepository } from '../repositories/events/events.repository';

@Injectable()
export class CreatePlanSubscriptionUseCase {
  constructor(
    private readonly planSubscriptionsDatabaseRepository: PlanSubscriptionsDatabaseRepository,
    private readonly planSubscriptionsEventsRepository: PlanSubscriptionsEventsRepository
  ) {}

  async execute(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    // Validate or reject
    const createPlanSubscriptionDtoInstance = plainToInstance(
      CreatePlanSubscriptionDto,
      createPlanSubscriptionDto
    );

    await validateOrReject(createPlanSubscriptionDtoInstance).catch(
      (validationErrors: ValidationError[]) => {
        throw new ValidationException(
          validationErrors,
          PLAN_SUBSCRIPTIONS_ERROR_MESSAGES['VALIDATION']['INVALID_EMAIL']
        );
      }
    );

    // Execute
    const planSubscription =
      await this.planSubscriptionsDatabaseRepository.create(
        createPlanSubscriptionDto
      );

    await this.planSubscriptionsEventsRepository.publishPlanSubscriptionCreated(
      planSubscription
    );

    return { planSubscription };
  }
}
