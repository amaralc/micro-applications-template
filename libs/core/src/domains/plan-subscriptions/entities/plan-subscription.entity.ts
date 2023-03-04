import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

// Abstraction
export interface IMakePlanSubscriptionProps {
  id?: string;
  isActive?: boolean;
  email: string;
  plan: string;
}

export class PlanSubscription {
  id: string;
  isActive: boolean;
  email!: string;
  plan!: string;

  constructor({ email, plan, id, isActive }: IMakePlanSubscriptionProps) {
    this.id = id ?? randomUUID();
    this.isActive = isActive ?? true;
    this.email = email;
    this.plan = plan;
  }
}

// Mongoose implementation
@Schema({ collection: 'planSubscriptions' })
export class MongoosePlanSubscription extends Document implements PlanSubscription {
  @Prop()
  override id!: string;

  @Prop({ type: Boolean })
  isActive!: boolean;

  @Prop({ type: String })
  email!: string;

  @Prop({ type: String })
  plan!: string;
}

export const MongoosePlanSubscriptionSchema = SchemaFactory.createForClass(MongoosePlanSubscription);
