import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { ValidationException } from '../../../errors/validation-exception';
import { CreateUserService } from '../../users/services/create-user.service';
import { PlanSubscriptionCreatedMessageDto } from '../dto/plan-subscription-created-message.dto';

@Injectable()
export class HandlePlanSubscriptionCreatedService {
  constructor(private readonly createUserService: CreateUserService) {}

  async execute(message: unknown): Promise<void> {
    const instance = plainToInstance(
      PlanSubscriptionCreatedMessageDto,
      message
    );
    await validateOrReject(instance).catch(
      (validationErrors: ValidationError[]) => {
        throw new ValidationException(validationErrors, 'Invalid payload');
      }
    );
    await this.createUserService.execute({ email: instance.email });
  }
}
