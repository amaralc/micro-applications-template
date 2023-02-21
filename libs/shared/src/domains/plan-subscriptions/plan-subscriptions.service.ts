import { GlobalAppHttpException } from '@auth/shared/errors/global-app-http-exception';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreatePlanSubscriptionDto } from './dto/create-plan-subscription.dto';
import { ConsumePlanSubscriptionCreatedUseCase } from './use-cases/consume-plan-subscription-created.use-case';
import { CreatePlanSubscriptionUseCase } from './use-cases/create-plan-subscription.use-case';
import { ParseOrRejectPlanSubscriptionCreatedMessageUseCase } from './use-cases/parse-or-reject-plan-subscription-created-message.use-case';

const className = 'PlanSubscriptionsService';
@Injectable()
export class PlanSubscriptionsService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly createPlanSubscriptionUseCase: CreatePlanSubscriptionUseCase,
    private readonly consumePlanSubscriptionCreatedUseCase: ConsumePlanSubscriptionCreatedUseCase,
    private readonly parseOrRejectPlanSubscriptionCreatedMessageUseCase: ParseOrRejectPlanSubscriptionCreatedMessageUseCase
  ) {}

  onModuleInit() {
    this.consumePlanSubscriptionCreatedUseCase.execute(async (payload) => {
      try {
        const f = this.parseOrRejectPlanSubscriptionCreatedMessageUseCase;
        const jsonMessage = await f.execute(payload);
        await this.usersService.create({ email: jsonMessage.email });
      } catch (error) {
        console.log(error);
        Logger.warn(
          'Error while consuming plan subscription created message',
          className
        );
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
