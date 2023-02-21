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

  async create(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    const { email, plan } = createPlanSubscriptionDto;
    const isExistingPlanSubscription = await this.findByEmail(email);
    if (isExistingPlanSubscription) {
      throw new ConflictException(
        PLAN_SUBSCRIPTIONS_ERROR_MESSAGES['CONFLICT_EMAIL_ALREADY_EXIST']
      );
    }
    const user = new PlanSubscription({ email, plan });
    this.planSubscriptions.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<PlanSubscription | null> {
    return this.planSubscriptions.find((user) => user.email === email) || null;
  }

  async findAll() {
    return this.planSubscriptions;
  }
}
