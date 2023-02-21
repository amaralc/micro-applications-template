// planSubscriptions.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePlanSubscriptionDto } from '../../../dto/create-plan-subscription.dto';
import { PlanSubscription } from '../../../entities/plan-subscription.entity';
import { PLAN_SUBSCRIPTIONS_ERROR_MESSAGES } from '../../../errors/error-messages';
import { PlanSubscriptionsDatabaseRepository } from '../database.repository';

@Injectable()
export class InMemoryPlanSubscriptionsDatabaseRepository
  implements PlanSubscriptionsDatabaseRepository
{
  private planSubscriptions: PlanSubscription[] = [];

  async create(
    createPlanSubscriptionDto: CreatePlanSubscriptionDto
  ): Promise<PlanSubscription> {
    const { email, plan } = createPlanSubscriptionDto;
    const isExistingPlanSubscription = await this.findByEmail(email);

    if (isExistingPlanSubscription) {
      throw new ConflictException(
        PLAN_SUBSCRIPTIONS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']
      );
    }
    const planSubscription = new PlanSubscription({ email, plan });
    return planSubscription;
  }

  async findByEmail(email: string): Promise<PlanSubscription | null> {
    return (
      this.planSubscriptions.find(
        (planSubscription) => planSubscription.email === email
      ) || null
    );
  }

  async findAll() {
    return this.planSubscriptions;
  }
}
