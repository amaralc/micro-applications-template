// users.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlanSubscriptionDto } from '../../../dto/create-plan-subscription.dto';
import {
  MongoosePlanSubscription,
  PlanSubscription,
} from '../../../entities/plan-subscription.entity';
import { PLAN_SUBSCRIPTIONS_ERROR_MESSAGES } from '../../../errors/error-messages';
import { PlanSubscriptionsDatabaseRepository } from '../database.repository';

@Injectable()
export class MongooseMongoDbPlanSubscriptionsDatabaseRepository
  implements PlanSubscriptionsDatabaseRepository
{
  constructor(
    @InjectModel(MongoosePlanSubscription.name)
    private readonly planSubscriptionModel: Model<MongoosePlanSubscription>
  ) {}

  async create(
    createPlanSubscriptionDto: CreatePlanSubscriptionDto
  ): Promise<PlanSubscription> {
    const { email, plan } = createPlanSubscriptionDto;
    const subscriptionExists = await this.findByEmail(email);
    if (subscriptionExists) {
      throw new ConflictException(
        PLAN_SUBSCRIPTIONS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']
      );
    }

    const mongoosePlanSubscription = new this.planSubscriptionModel({
      isActive: true,
      email,
      plan,
    });
    mongoosePlanSubscription.save();

    const applicationPlanSubscription = new PlanSubscription({
      id: mongoosePlanSubscription.id,
      email: mongoosePlanSubscription.email,
      isActive: mongoosePlanSubscription.isActive,
      plan,
    });
    return applicationPlanSubscription;
  }

  async findByEmail(email: string): Promise<PlanSubscription | null> {
    const mongoosePlanSubscription = await this.planSubscriptionModel
      .findOne({
        email,
      })
      .exec();
    if (!mongoosePlanSubscription) {
      return null;
    }

    const applicationPlanSubscription = new PlanSubscription({
      id: mongoosePlanSubscription.id,
      isActive: mongoosePlanSubscription.isActive,
      email: mongoosePlanSubscription.email,
      plan: mongoosePlanSubscription.plan,
    });
    return applicationPlanSubscription;
  }

  async findAll() {
    const mongoosePlanSubscriptions = await this.planSubscriptionModel
      .find()
      .exec();
    const applicationPlanSubscriptions = mongoosePlanSubscriptions.map(
      (subscription) =>
        new PlanSubscription({
          id: subscription.id,
          isActive: subscription.isActive,
          email: subscription.email,
          plan: subscription.plan,
        })
    );
    return applicationPlanSubscriptions;
  }
}
