import { PlanSubscriptionEntity } from '../entities/plan-subscription.entity';

// Abstraction
export abstract class PlanSubscriptionsEventsRepository {
  abstract publishPlanSubscriptionCreated(planSubscription: PlanSubscriptionEntity): Promise<void>;
}
