import { Injectable, Logger } from '@nestjs/common';
import { GlobalAppHttpException } from '../../errors/global-app-http-exception';
import { ValidationException } from '../../errors/validation-exception';
import { USERS_ERROR_MESSAGES } from '../users/errors/error-messages';
import { UserConflictException } from '../users/errors/user-conflict-exception';
import { UsersService } from '../users/users.service';
import { CreatePlanSubscriptionDto } from './dto/create-plan-subscription.dto';
import { ConsumePlanSubscriptionCreatedUseCase } from './use-cases/consume-plan-subscription-created.use-case';
import { CreatePlanSubscriptionUseCase } from './use-cases/create-plan-subscription.use-case';
import { ParseOrRejectPlanSubscriptionCreatedMessageUseCase } from './use-cases/parse-or-reject-plan-subscription-created-message.use-case';

const className = 'PlanSubscriptionsService';
@Injectable()
export class PlanSubscriptionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly createPlanSubscriptionUseCase: CreatePlanSubscriptionUseCase,
    private readonly consumePlanSubscriptionCreatedUseCase: ConsumePlanSubscriptionCreatedUseCase,
    private readonly parseOrRejectPlanSubscriptionCreatedMessageUseCase: ParseOrRejectPlanSubscriptionCreatedMessageUseCase
  ) {}

  async consumePlanSubscriptionCreatedAndCreateUsers() {
    this.consumePlanSubscriptionCreatedUseCase.execute(async (payload) => {
      try {
        const f = this.parseOrRejectPlanSubscriptionCreatedMessageUseCase;
        const jsonMessage = await f.execute(payload);
        await this.usersService.create({ email: jsonMessage.email });
      } catch (error) {
        if (error instanceof ValidationException) {
          return Logger.warn(
            'Invalid message payload: ' + JSON.stringify(error.causes),
            className
          );
        }

        if (error instanceof UserConflictException) {
          return Logger.warn(
            USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS'] +
              JSON.stringify(error.cause),
            className
          );
        }

        Logger.warn('Error while consuming message: ', JSON.stringify(error));
      }
    });
  }

  async create(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    try {
      const response = await this.createPlanSubscriptionUseCase.execute(
        createPlanSubscriptionDto
      );

      return response;
    } catch (error) {
      throw new GlobalAppHttpException(error);
    }
  }
}
