import { Controller } from '@nestjs/common';
import { PlanSubscriptionsService } from './plan-subscriptions.service';

@Controller('plan-subscriptions')
export class PlanSubscriptionsController {
  constructor(private planSubscriptionsService: PlanSubscriptionsService) {}

  // @Post()
  // create(@Body() createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
  //   return this.planSubscriptionsService.create(createPlanSubscriptionDto);
  // }
}
