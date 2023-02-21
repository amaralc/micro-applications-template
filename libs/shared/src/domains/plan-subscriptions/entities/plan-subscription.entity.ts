import { randomUUID } from 'crypto';

export interface IPlanSubscriptionProps {
  id?: string;
  isActive?: boolean;
  email: string;
  plan: string;
}

export class PlanSubscription {
  id: IPlanSubscriptionProps['id'];
  isActive: IPlanSubscriptionProps['isActive'];
  email!: IPlanSubscriptionProps['email'];
  plan!: IPlanSubscriptionProps['plan'];

  constructor({ email, plan, id, isActive }: IPlanSubscriptionProps) {
    this.id = id ?? randomUUID();
    this.isActive = isActive ?? true;
    this.email = email;
    this.plan = plan;
  }
}
