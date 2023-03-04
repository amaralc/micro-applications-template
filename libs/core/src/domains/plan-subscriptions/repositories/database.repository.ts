import { CreatePlanSubscriptionDto } from '../entities/create-plan-subscription.dto';
import { ListPaginatedPlanSubscriptionsDto } from '../entities/list-paginated-plan-subscriptions.dto';
import { PlanSubscription } from '../entities/plan-subscription.entity';
import { PlanSubscriptionEntity } from '../entities/plan-subscription/entity';

// Abstraction
export abstract class PlanSubscriptionsDatabaseRepository {
  abstract create(createPlanSubscriptionDto: CreatePlanSubscriptionDto): Promise<PlanSubscription>;
  abstract listPaginated(
    listPaginatedPlanSubscriptionsDto: ListPaginatedPlanSubscriptionsDto
  ): Promise<Array<PlanSubscriptionEntity>>;
  abstract findByEmail(email: string): Promise<PlanSubscription | null>;
}
