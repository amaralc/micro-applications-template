import { PlanSubscriptionCreatedMessageDto } from '@core/domains/plan-subscriptions/entities/plan-subscription-created-message.dto';
import { HandlePlanSubscriptionCreatedService } from '@core/domains/plan-subscriptions/services/handle-plan-subscription-created.service';
import { USERS_ERROR_MESSAGES } from '@core/domains/users/errors/error-messages';
import { ValidationException } from '@core/errors/validation-exception';
import { ConflictException, Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';

/**
 * @see https://stackoverflow.com/questions/74403746/infinite-retries-when-using-rpcfilter-in-nestjs-microservice-setup-with-kafka
 * @see https://docs.nestjs.com/microservices/kafka#retriable-exceptions
 */

@Controller()
export class PlanSubscriptionsConsumerController {
  constructor(private readonly handlePlanSubscriptionCreatedService: HandlePlanSubscriptionCreatedService) {}

  @EventPattern('plan-subscription-created')
  async handlePlanSubscriptionCreated(
    @Payload() data: PlanSubscriptionCreatedMessageDto,
    @Ctx() context: KafkaContext
  ) {
    try {
      await this.handlePlanSubscriptionCreatedService.execute(data);
      Logger.log('Message: ' + JSON.stringify(context.getMessage()), PlanSubscriptionsConsumerController.name);
      Logger.log('Message processed: ' + JSON.stringify(data), PlanSubscriptionsConsumerController.name);
    } catch (error) {
      if (error instanceof ValidationException) {
        return Logger.warn('Invalid message payload: ' + JSON.stringify(error));
      }

      if (error instanceof ConflictException) {
        return Logger.warn(USERS_ERROR_MESSAGES['CONFLICTING_EMAIL'], HandlePlanSubscriptionCreatedService.name);
      }

      Logger.warn('Error while consuming message: ', JSON.stringify(error));
    }
  }
}
