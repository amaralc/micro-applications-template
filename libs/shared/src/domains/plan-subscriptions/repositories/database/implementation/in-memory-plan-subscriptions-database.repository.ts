// planSubscriptions.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePlanSubscriptionDto } from '../../../../dto/create-plan-subscription.dto';
import { PlanSubscription } from '../../../../entities/plan-subscription.entity';
import { PlanSubscriptionsDatabaseRepository } from '../plan-subscriptions-database.repository';

@Injectable()
export class InMemoryPlanSubscriptionsDatabaseRepository
  implements PlanSubscriptionsDatabaseRepository
{
  private planSubscriptions: PlanSubscription[] = [];

  async create(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    const { email, plan } = createPlanSubscriptionDto;
    const isExistingPlanSubscription = await this.findByEmail(email);
    if (isExistingPlanSubscription) {
      throw new ConflictException('This e-mail is already taken');
    }
    const user = new PlanSubscription(email, plan);
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
