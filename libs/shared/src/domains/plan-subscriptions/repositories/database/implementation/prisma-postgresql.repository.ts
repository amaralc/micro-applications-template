// users.repository.ts
import { ListPaginatedPlanSubscriptionsDto } from '@adapters/plan-subscriptions/list-paginated-plan-subscriptions.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { pagination } from '../../../../../config';
import { PrismaService } from '../../../../../infra/storage/prisma/prisma.service';
import { CreatePlanSubscriptionDto } from '../../../dto/create-plan-subscription.dto';
import { PlanSubscription } from '../../../entities/plan-subscription.entity';
import { PlanSubscriptionEntity } from '../../../entities/plan-subscription/entity';
import { PLAN_SUBSCRIPTIONS_ERROR_MESSAGES } from '../../../errors/error-messages';
import { PlanSubscriptionsDatabaseRepository } from '../database.repository';

@Injectable()
export class PrismaPostgreSqlPlanSubscriptionsDatabaseRepository implements PlanSubscriptionsDatabaseRepository {
  constructor(private prismaService: PrismaService) {}

  async create(createPlanSubscriptionDto: CreatePlanSubscriptionDto): Promise<PlanSubscription> {
    const { email, plan } = createPlanSubscriptionDto;
    const subscriptionExists = await this.findByEmail(email);
    if (subscriptionExists) {
      throw new ConflictException(PLAN_SUBSCRIPTIONS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']);
    }

    const prismaPlanSubscription = await this.prismaService.plan_subscriptions.create({
      data: { is_active: true, email, plan },
    });

    const applicationPlanSubscription = new PlanSubscription({
      id: prismaPlanSubscription.id,
      email: prismaPlanSubscription.email,
      plan,
      isActive: prismaPlanSubscription.is_active,
    });
    return applicationPlanSubscription;
  }

  async findByEmail(email: string): Promise<PlanSubscription | null> {
    const prismaPlanSubscription = await this.prismaService.plan_subscriptions.findFirst({
      where: {
        email,
      },
    });
    if (!prismaPlanSubscription) {
      return null;
    }

    const applicationPlanSubscription = new PlanSubscription({
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
