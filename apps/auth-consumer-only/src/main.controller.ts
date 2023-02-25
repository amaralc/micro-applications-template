import { PlanSubscriptionCreatedMessageDto } from '@auth/shared/domains/plan-subscriptions/dto/plan-subscription-created-message.dto';
import { HandlePlanSubscriptionCreatedService } from '@auth/shared/domains/plan-subscriptions/services/handle-plan-subscription-created.service';
import { USERS_ERROR_MESSAGES } from '@auth/shared/domains/users/errors/error-messages';
import { UserConflictException } from '@auth/shared/domains/users/errors/user-conflict-exception';
import { ValidationException } from '@auth/shared/errors/validation-exception';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

/**
 * @see https://stackoverflow.com/questions/74403746/infinite-retries-when-using-rpcfilter-in-nestjs-microservice-setup-with-kafka
 * @see https://docs.nestjs.com/microservices/kafka#retriable-exceptions
 */

@Controller()
export class KafkaPlanSubscriptionConsumerController {
  constructor(
    private readonly handlePlanSubscriptionCreatedService: HandlePlanSubscriptionCreatedService
  ) {}

  @EventPattern('plan-subscription-created')
  async handlePlanSubscriptionCreated(
    @Payload() data: PlanSubscriptionCreatedMessageDto,
    @Ctx() context: KafkaContext
  ) {
    try {
      this.handlePlanSubscriptionCreatedService.execute(data);
      Logger.log(
        'Message: ' + JSON.stringify(context.getMessage()),
        KafkaPlanSubscriptionConsumerController.name
      );
      Logger.log(
        'Message processed: ' + JSON.stringify(data),
        KafkaPlanSubscriptionConsumerController.name
      );
    } catch (error) {
      Logger.error(
        'Message skipped: ' + JSON.stringify(error),
        KafkaPlanSubscriptionConsumerController.name
      );
      if (error instanceof ValidationException) {
        return Logger.warn(
          'Invalid message payload: ' + JSON.stringify(error.causes),
          HandlePlanSubscriptionCreatedService.name
        );
      }

      if (error instanceof UserConflictException) {
        return Logger.warn(
          USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS'] +
            JSON.stringify(error.cause),
          HandlePlanSubscriptionCreatedService.name
        );
      }

      Logger.warn('Error while consuming message: ', JSON.stringify(error));
    }
  }
}
