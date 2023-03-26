import { PlanSubscriptionCreatedMessageDto } from '@core/domains/plan-subscriptions/entities/plan-subscription-created-message/dto';
import { HandlePlanSubscriptionCreatedService } from '@core/domains/plan-subscriptions/handlers/handle-plan-subscription-created.service';
import { ApplicationLogger } from '@core/shared/logs/application-logger';
import { EventErrorLog } from '@core/shared/logs/event-error-log';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';

/**
 * @see https://stackoverflow.com/questions/74403746/infinite-retries-when-using-rpcfilter-in-nestjs-microservice-setup-with-kafka
 * @see https://docs.nestjs.com/microservices/kafka#retriable-exceptions
 */

@Controller()
export class PlanSubscriptionsConsumerController {
  constructor(
    private readonly logger: ApplicationLogger,
    private readonly handlePlanSubscriptionCreatedService: HandlePlanSubscriptionCreatedService
  ) {}

  @EventPattern('plan-subscription-created')
  async handlePlanSubscriptionCreated(
    @Payload() data: PlanSubscriptionCreatedMessageDto,
    @Ctx() context: KafkaContext
  ) {
    const start = Number(new Date());
    let log = {
      className: PlanSubscriptionsConsumerController.name,
      data,
      context,
    };
    try {
      await this.handlePlanSubscriptionCreatedService.execute(data);
      const end = Number(new Date());
      log = { ...log, ...{ durationInMs: end - start } };
      this.logger.info('Message processed', log);
    } catch (error) {
      const end = Number(new Date());
      log = { ...log, ...{ durationInMs: end - start } };
      new EventErrorLog(this.logger, error, log);
    }
  }
}
