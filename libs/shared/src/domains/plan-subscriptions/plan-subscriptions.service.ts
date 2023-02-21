import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumePlanSubscriptionCreatedUseCase } from './use-cases/consume-plan-subscription-created.use-case';
import { CreateUserFromPlanSubscriptionCreatedUseCase } from './use-cases/create-user-from-plan-subscription-created.use-case';

@Injectable()
export class PlanSubscriptionsService implements OnModuleInit {
  constructor(
    private readonly consumePlanSubscriptionCreatedUseCase: ConsumePlanSubscriptionCreatedUseCase,
    private readonly createUserFromPlanSubscriptionCreatedUseCase: CreateUserFromPlanSubscriptionCreatedUseCase
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

  // async create(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
  //   try {
  //     const planSubscription =
  //       await this.planSubscriptionsDatabaseRepository.create(
  //         createPlanSubscriptionDto
  //       );

  //     await this.planSubscriptionsEventsRepository.publishPlanSubscriptionCreated(
  //       planSubscription
  //     );
  //   } catch (error) {
  //     throw new GlobalAppHttpException(error);
  //   }
  // }
}
