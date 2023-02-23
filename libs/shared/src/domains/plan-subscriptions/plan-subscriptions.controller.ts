import { Body, Controller, Post } from '@nestjs/common';
import { GlobalAppHttpException } from '../../errors/global-app-http-exception';
import { CreatePlanSubscriptionDto } from './dto/create-plan-subscription.dto';
import { CreatePlanSubscriptionService } from './services/create-plan-subscription.service';

@Controller('plan-subscriptions')
export class PlanSubscriptionsController {
  constructor(
    private createPlanSubscriptionService: CreatePlanSubscriptionService
  ) {}

  @Post()
  async create(@Body() createPlanSubscriptionDto: CreatePlanSubscriptionDto) {
    try {
      const response = await this.createPlanSubscriptionService.execute(
        createPlanSubscriptionDto
      );
      return response;
    } catch (error) {
      throw new GlobalAppHttpException(error);
    }
  }
}
