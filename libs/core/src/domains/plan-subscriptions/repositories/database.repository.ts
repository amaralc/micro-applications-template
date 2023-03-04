import { CreatePlanSubscriptionDto } from '../dto/create-plan-subscription.dto';
import { ListPaginatedPlanSubscriptionsDto } from '../dto/list-paginated-plan-subscriptions.dto';
import { PlanSubscriptionEntity } from '../entities/plan-subscription/entity';

// Abstraction
export abstract class PlanSubscriptionsDatabaseRepository {
  abstract create(createPlanSubscriptionDto: CreatePlanSubscriptionDto): Promise<PlanSubscriptionEntity>;
  abstract listPaginated(
    listPaginatedPlanSubscriptionsDto: ListPaginatedPlanSubscriptionsDto
  ): Promise<Array<PlanSubscriptionEntity>>;
  abstract findByEmail(email: string): Promise<PlanSubscriptionEntity | null>;
}
