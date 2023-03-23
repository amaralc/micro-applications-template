import { PlanSubscriptionEntity } from '@core/domains/plan-subscriptions/entities/plan-subscription.entity';
import { PLAN_SUBSCRIPTIONS_ERROR_MESSAGES } from '@core/domains/plan-subscriptions/errors/error-messages';
import { PlanSubscriptionsDatabaseRepository } from '@core/domains/plan-subscriptions/repositories/database.repository';
import { CreatePlanSubscriptionDto } from '@core/domains/plan-subscriptions/services/create-plan-subscription.dto';
import { ListPaginatedPlanSubscriptionsDto } from '@core/domains/plan-subscriptions/services/list-paginated-plan-subscriptions.dto';
import { pagination } from '@core/shared/config';
import { PrismaService } from '@infra/database/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class PrismaPostgreSqlPlanSubscriptionsDatabaseRepository implements PlanSubscriptionsDatabaseRepository {
  constructor(private prismaService: PrismaService) {}

  async create(createPlanSubscriptionDto: CreatePlanSubscriptionDto): Promise<PlanSubscriptionEntity> {
    const { email, plan } = createPlanSubscriptionDto;
    const subscriptionExists = await this.findByEmail(email);
    if (subscriptionExists) {
      throw new ConflictException(PLAN_SUBSCRIPTIONS_ERROR_MESSAGES['CONFLICTING_EMAIL']);
    }

    const prismaPlanSubscription = await this.prismaService.plan_subscriptions.create({
      data: { is_active: true, email, plan },
    });

    const applicationPlanSubscription = new PlanSubscriptionEntity({
      id: prismaPlanSubscription.id,
      email: prismaPlanSubscription.email,
      plan,
      isActive: prismaPlanSubscription.is_active,
    });
    return applicationPlanSubscription;
  }

  async findByEmail(email: string): Promise<PlanSubscriptionEntity | null> {
    const prismaPlanSubscription = await this.prismaService.plan_subscriptions.findFirst({
      where: {
        email,
      },
    });
    if (!prismaPlanSubscription) {
      return null;
    }

    const applicationPlanSubscription = new PlanSubscriptionEntity({
      id: prismaPlanSubscription.id,
      isActive: prismaPlanSubscription.is_active,
      email: prismaPlanSubscription.email,
      plan: prismaPlanSubscription.plan,
    });
    return applicationPlanSubscription;
  }

  async listPaginated(listPaginatedPlanSubscriptionsDto: ListPaginatedPlanSubscriptionsDto) {
    const { limit, page } = listPaginatedPlanSubscriptionsDto;
    const localLimit = limit || pagination.defaultLimit;
    const localOffset = page ? page - 1 : pagination.defaultPage - 1;

    const prismaPlanSubscriptions = await this.prismaService.plan_subscriptions.findMany({
      skip: localOffset,
      take: localLimit,
    });
    const planSubscriptionEntities = prismaPlanSubscriptions.map(
      (subscription) =>
        new PlanSubscriptionEntity({
          id: subscription.id,
          isActive: subscription.is_active,
          email: subscription.email,
          plan: subscription.plan,
        })
    );
    return planSubscriptionEntities;
  }
}
