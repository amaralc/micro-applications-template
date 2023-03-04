import { randomUUID } from 'crypto';
import { Replace } from '../../../../helpers/replace';
import { PlanSubscriptionCreatedMessageDto } from './dto';

type IMakePlanSubscriptionCreatedMessageProps = Replace<
  PlanSubscriptionCreatedMessageDto,
  { id?: string; isActive?: boolean }
>;

export class PlanSubscriptionCreatedMessageEntity extends PlanSubscriptionCreatedMessageDto {
  constructor({ id, email, isActive, plan }: IMakePlanSubscriptionCreatedMessageProps) {
    super();
    this.id = id ?? randomUUID();
    this.isActive = isActive ?? true;
    this.email = email;
    this.plan = plan;
  }
}
