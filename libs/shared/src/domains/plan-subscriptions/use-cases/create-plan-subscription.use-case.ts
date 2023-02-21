import { CreatePlanSubscriptionDto } from '../dto/create-plan-subscription.dto';
import { PlanSubscriptionsDatabaseRepository } from '../repositories/database/database.repository';
import { PlanSubscriptionsEventsRepository } from '../repositories/events/events.repository';

export class CreatePlanSubscriptionUseCase {
  constructor(
    private readonly planSubscriptionsDatabaseRepository: PlanSubscriptionsDatabaseRepository,
    private readonly planSubscriptionsEventsRepository: PlanSubscriptionsEventsRepository
  ) {}

  async execute(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    // Validate or reject

    // Execute
    const planSubscription =
      await this.planSubscriptionsDatabaseRepository.create(
        createPlanSubscriptionDto
      );

    await this.planSubscriptionsEventsRepository.publishPlanSubscriptionCreated(
      planSubscription
    );
  }
}
