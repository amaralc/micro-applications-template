import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { ValidationException } from '../../../errors/validation-exception';
import { USERS_ERROR_MESSAGES } from '../../users/errors/error-messages';
import { UserConflictException } from '../../users/errors/user-conflict-exception';
import { CreateUserService } from '../../users/services/create-user.service';
import { PlanSubscriptionCreatedMessageDto } from '../dto/plan-subscription-created-message.dto';

@Injectable()
export class HandlePlanSubscriptionCreatedService {
  readonly logger: Logger = new Logger(
    HandlePlanSubscriptionCreatedService.name
  );
  constructor(private readonly createUserService: CreateUserService) {}

  async execute(message: unknown): Promise<void> {
    try {
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
    } catch (error) {
      if (error instanceof ValidationException) {
        return this.logger.warn(
          'Invalid message payload: ' + JSON.stringify(error)
        );
      }

      if (error instanceof UserConflictException) {
        return this.logger.warn(
          USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS'],
          HandlePlanSubscriptionCreatedService.name
        );
      }

      Logger.warn('Error while consuming message: ', JSON.stringify(error));
    }
  }
}
