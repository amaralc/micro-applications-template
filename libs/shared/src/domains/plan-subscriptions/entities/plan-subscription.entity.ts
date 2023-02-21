import { randomUUID } from 'crypto';
import { CreatePlanSubscriptionDto } from '../dto/create-plan-subscription.dto';

export interface IPlanSubscriptionProps {
  id: string;
  email: string;
  plan: string;
  isActive: boolean;
}

export class PlanSubscription {
  id: IPlanSubscriptionProps['id'];
  email: IPlanSubscriptionProps['email'];
  plan: IPlanSubscriptionProps['plan'];
  isActive: IPlanSubscriptionProps['isActive'] = false;

  constructor(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    const { id, email, plan, isActive } = createPlanSubscriptionDto;
    this.id = id ?? randomUUID();
    this.isActive = isActive ?? true;
    this.email = email;
    this.plan = plan;
  }
}
