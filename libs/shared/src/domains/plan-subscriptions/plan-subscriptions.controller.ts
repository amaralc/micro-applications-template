import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlanSubscriptionDto } from './dto/create-plan-subscription.dto';
import { PlanSubscriptionsService } from './plan-subscriptions.service';

@Controller('plan-subscriptions')
export class PlanSubscriptionsController {
  constructor(private planSubscriptionsService: PlanSubscriptionsService) {}

  @Post()
  create(@Body() createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    return this.planSubscriptionsService.create(createPlanSubscriptionDto);
  }
}
