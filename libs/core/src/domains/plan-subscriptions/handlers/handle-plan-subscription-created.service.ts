import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { ValidationException } from '../../../shared/errors/validation-exception';
import { isJsonObject } from '../../../shared/helpers/is-json-object';
import { PlanSubscriptionCreatedMessageDto } from '../entities/plan-subscription-created-message/dto';
import { CreatePlanSubscriptionService } from '../services/create-plan-subscription.service';

@Injectable()
export class HandlePlanSubscriptionCreatedService {
  readonly logger: Logger = new Logger(HandlePlanSubscriptionCreatedService.name);
  constructor(private readonly createPlanSubscriptionService: CreatePlanSubscriptionService) {}

  async execute(message: unknown): Promise<void> {
    const validObject = isJsonObject(message);
    if (!validObject) {
      throw new ValidationException([], 'Message is not json object');
    }
    const instance = plainToInstance(PlanSubscriptionCreatedMessageDto, message);
    await validateOrReject(instance).catch((validationErrors: ValidationError[]) => {
      throw new ValidationException(validationErrors, 'Invalid payload');
    });
    await this.createPlanSubscriptionService.execute(instance);
  }
}
