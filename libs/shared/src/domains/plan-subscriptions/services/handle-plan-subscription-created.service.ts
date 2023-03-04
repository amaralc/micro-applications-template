import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { ValidationException } from '../../../errors/validation-exception';
import { PlanSubscriptionCreatedMessageDto } from '../entities/plan-subscription-created-message/dto';
import { CreatePlanSubscriptionService } from './create-plan-subscription.service';

@Injectable()
export class HandlePlanSubscriptionCreatedService {
  readonly logger: Logger = new Logger(HandlePlanSubscriptionCreatedService.name);
  constructor(private readonly createPlanSubscriptionService: CreatePlanSubscriptionService) {}

  async execute(message: unknown): Promise<void> {
    const instance = plainToInstance(PlanSubscriptionCreatedMessageDto, message);
    await validateOrReject(instance).catch((validationErrors: ValidationError[]) => {
      throw new ValidationException(validationErrors, 'Invalid payload');
    });
    await this.createPlanSubscriptionService.execute(instance);
  }
}
