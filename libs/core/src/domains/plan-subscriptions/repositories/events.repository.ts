import { PlanSubscription } from '../entities/plan-subscription.entity';

// Abstraction
export abstract class PlanSubscriptionsEventsRepository {
  abstract publishPlanSubscriptionCreated(planSubscription: PlanSubscription): Promise<void>;
}
