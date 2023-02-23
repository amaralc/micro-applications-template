import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ValidationException } from '../../errors/validation-exception';
import { USERS_ERROR_MESSAGES } from '../users/errors/error-messages';
import { UserConflictException } from '../users/errors/user-conflict-exception';
import { CreateUserService } from '../users/services/create-user.service';
import { ConsumePlanSubscriptionCreatedService } from './services/consume-plan-subscription-created.service';
import { ParseOrRejectPlanSubscriptionCreatedMessageService } from './services/parse-or-reject-plan-subscription-created-message.service';

@Injectable()
export class PlanSubscriptionsConsumer implements OnModuleInit {
  constructor(
    private consumePlanSubscriptionCreatedService: ConsumePlanSubscriptionCreatedService,
    private readonly parseOrRejectPlanSubscriptionCreatedMessageService: ParseOrRejectPlanSubscriptionCreatedMessageService,
    private readonly createUserService: CreateUserService
  ) {}

  onModuleInit() {
    this.consumePlanSubscriptionCreatedService.execute(async (payload) => {
      try {
        const jsonMessage =
          await this.parseOrRejectPlanSubscriptionCreatedMessageService.execute(
            payload
          );
        await this.createUserService.execute({ email: jsonMessage.email });
      } catch (error) {
        if (error instanceof ValidationException) {
          return Logger.warn(
            'Invalid message payload: ' + JSON.stringify(error.causes),
            PlanSubscriptionsConsumer.name
          );
        }

        if (error instanceof UserConflictException) {
          return Logger.warn(
            USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS'] +
              JSON.stringify(error.cause),
            PlanSubscriptionsConsumer.name
          );
        }

        Logger.warn('Error while consuming message: ', JSON.stringify(error));
      }
    });
  }
}
