// users.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infra/storage/prisma/prisma.service';
import { CreatePlanSubscriptionDto } from '../../../dto/create-plan-subscription.dto';
import { PlanSubscription } from '../../../entities/plan-subscription.entity';
import { PlanSubscriptionsDatabaseRepository } from '../plan-subscriptions-database.repository';

@Injectable()
export class PrismaPlanSubscriptionsDatabaseRepository
  implements PlanSubscriptionsDatabaseRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(
    createPlanSubscriptionDto: CreatePlanSubscriptionDto
  ): Promise<PlanSubscription> {
    const { email, plan } = createPlanSubscriptionDto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException('This e-mail is already taken');
    }

    const prismaPlanSubscription = await this.prismaService.users.create({
      data: { email },
    });
    const applicationPlanSubscription = new PlanSubscription(
      prismaPlanSubscription.email,
      plan
    );
    return applicationPlanSubscription;
  }

  async findByEmail(email: string): Promise<PlanSubscription | null> {
    const prismaPlanSubscription =
      await this.prismaService.plan_subscriptions.findFirst({
        where: {
          email,
        },
      });
    if (!prismaPlanSubscription) {
      return null;
    }

    const applicationPlanSubscription = new PlanSubscription(
      prismaPlanSubscription.email,
      prismaPlanSubscription.plan
    );
    return applicationPlanSubscription;
  }

  async findAll() {
    const prismaPlanSubscriptions =
      await this.prismaService.plan_subscriptions.findMany();
    const applicationPlanSubscriptions = prismaPlanSubscriptions.map(
      (subscription) =>
        new PlanSubscription(subscription.email, subscription.plan)
    );
    return applicationPlanSubscriptions;
  }
}
