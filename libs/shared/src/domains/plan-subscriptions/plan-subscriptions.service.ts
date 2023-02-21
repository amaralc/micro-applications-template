import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePlanSubscriptionDto } from './dto/create-plan-subscription.dto';
import { ConsumePlanSubscriptionCreatedUseCase } from './use-cases/consume-plan-subscription-created.use-case';
import { CreatePlanSubscriptionUseCase } from './use-cases/create-plan-subscription.use-case';
import { CreateUserFromPlanSubscriptionCreatedUseCase } from './use-cases/create-user-from-plan-subscription-created.use-case';

@Injectable()
export class PlanSubscriptionsService implements OnModuleInit {
  constructor(
    private readonly consumePlanSubscriptionCreatedUseCase: ConsumePlanSubscriptionCreatedUseCase,
    private readonly createUserFromPlanSubscriptionCreatedUseCase: CreateUserFromPlanSubscriptionCreatedUseCase,
    private readonly createPlanSubscriptionUseCase: CreatePlanSubscriptionUseCase
  ) {}

  onModuleInit() {
    this.consumePlanSubscriptionCreated();
  }

  consumePlanSubscriptionCreated() {
    return this.consumePlanSubscriptionCreatedUseCase.execute(
      this.createUserFromPlanSubscriptionCreated()
    );
  }

  createUserFromPlanSubscriptionCreated() {
    return this.createUserFromPlanSubscriptionCreatedUseCase.execute;
  }

  create(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    this.createPlanSubscriptionUseCase.execute(createPlanSubscriptionDto);
  }
}
