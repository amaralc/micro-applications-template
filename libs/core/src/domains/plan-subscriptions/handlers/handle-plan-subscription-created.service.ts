import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ApplicationLogger } from '../../../shared/logs/application-logger';
import { parseOrRejectMessage } from '../../../shared/validators/parse-or-reject-message';
import { applicationValidateOrReject } from '../../../shared/validators/validate-or-reject';
import { PlanSubscriptionCreatedMessageDto } from '../entities/plan-subscription-created-message/dto';
import { PlanSubscriptionsDatabaseRepository } from '../repositories/database.repository';

@Injectable()
export class HandlePlanSubscriptionCreatedService {
  constructor(
    private readonly planSubscriptionsDatabaseRepository: PlanSubscriptionsDatabaseRepository,
    private readonly logger: ApplicationLogger
  ) {}

  async execute(message: unknown): Promise<void> {
    // validate
    const parsedMessage = parseOrRejectMessage(message);
    const planSubscriptionCreatedMessageDto = plainToInstance(PlanSubscriptionCreatedMessageDto, parsedMessage);
    await applicationValidateOrReject(planSubscriptionCreatedMessageDto);

    // Execute
    await this.planSubscriptionsDatabaseRepository.create(planSubscriptionCreatedMessageDto);

    // Log
    this.logger.info('Plan subscription created', { ...planSubscriptionCreatedMessageDto });
  }
}
