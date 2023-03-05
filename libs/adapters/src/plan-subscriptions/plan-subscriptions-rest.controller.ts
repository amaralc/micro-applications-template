import { PaginationQueryDto } from '@core/shared/pagination-query.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { ListPaginatedPlanSubscriptionsService } from '../../../core/src/domains/plan-subscriptions/services/list-paginated-plan-subscriptions.service';

@Controller('plan-subscriptions')
export class PlanSubscriptionsRestController {
  constructor(private listPaginatedPlanSubscriptionsService: ListPaginatedPlanSubscriptionsService) {}

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const planSubscriptions = await this.listPaginatedPlanSubscriptionsService.execute(paginationQuery);
    return { planSubscriptions };
  }
}
