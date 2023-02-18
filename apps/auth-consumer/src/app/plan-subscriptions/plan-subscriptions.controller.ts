import { CreatePlanSubscriptionDto } from '@auth/shared/domains/dto/create-plan-subscription.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { PlanSubscriptionsService } from './plan-subscriptions.service';

@Controller('plan-subscriptions')
export class PlanSubscriptionsController {
  constructor(private planSubscriptionsService: PlanSubscriptionsService) {}

  @Post()
  create(@Body() createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    return this.planSubscriptionsService.create(createPlanSubscriptionDto);
  }
}
