import { PaginationQueryDto } from '@adapters/shared/pagination-query.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { ListPaginatedPlanSubscriptionsService } from './services/list-paginated-plan-subscriptions.service';

@Controller('plan-subscriptions')
export class PlanSubscriptionsRestController {
  constructor(private listPaginatedPlanSubscriptionsService: ListPaginatedPlanSubscriptionsService) {}

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const planSubscriptions = await this.listPaginatedPlanSubscriptionsService.execute(paginationQuery);
    return { planSubscriptions };
  }
}
