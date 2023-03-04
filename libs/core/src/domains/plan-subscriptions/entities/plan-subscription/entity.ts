import { randomUUID } from 'crypto';
import { Replace } from '../../../../helpers/replace';
import { PlanSubscriptionDto } from './dto';

type IMakeDataLoggerProps = Replace<PlanSubscriptionDto, { id?: string; isActive?: boolean }>;

export class PlanSubscriptionEntity extends PlanSubscriptionDto {
  constructor({ id, email, isActive, plan }: IMakeDataLoggerProps) {
    super();
    this.id = id ?? randomUUID();
    this.isActive = isActive ?? true;
    this.email = email;
    this.plan = plan;
  }
}
