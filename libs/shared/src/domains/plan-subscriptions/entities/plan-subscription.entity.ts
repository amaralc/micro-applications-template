import { randomUUID } from 'crypto';

export class PlanSubscription {
  id: string;
  email: string;
  plan: string;
  isActive = false;

  constructor(email: string, plan: string) {
    this.id = randomUUID();
    this.email = email;
    this.plan = plan;
    this.isActive = true;
  }
}
