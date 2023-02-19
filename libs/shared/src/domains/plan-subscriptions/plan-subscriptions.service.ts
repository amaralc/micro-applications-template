import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreatePlanSubscriptionDto } from './dto/create-plan-subscription.dto';
import { PlanSubscriptionsDatabaseRepository } from './repositories/database/database.repository';
import { PlanSubscriptionsEventsRepository } from './repositories/events/events.repository';

@Injectable()
export class PlanSubscriptionsService implements OnModuleInit {
  constructor(
    private planSubscriptionsDatabaseRepository: PlanSubscriptionsDatabaseRepository,
    private planSubscriptionsEventsRepository: PlanSubscriptionsEventsRepository
  ) {}

  async create(createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    try {
      const planSubscription =
        await this.planSubscriptionsDatabaseRepository.create(
          createPlanSubscriptionDto
        );
      this.planSubscriptionsEventsRepository.publishPlanSubscriptionCreated(
        planSubscription
      );
    } catch (e) {
      throw new ConflictException(e);
    }
  }

  onModuleInit() {
    Logger.log('Initializing plan subscriptions service consumers...');
    this.planSubscriptionsEventsRepository.consumePlanSubscriptionCreatedAndUpdateUsers();
  }
}
