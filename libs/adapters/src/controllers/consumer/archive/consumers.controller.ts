import { HandlePlanSubscriptionCreatedService } from '@core/domains/plan-subscriptions/handlers/handle-plan-subscription-created.service';
import { Controller, OnModuleInit } from '@nestjs/common';
import { configDto } from '../../../config.dto';
import { ITopicSubscribers } from '../../../events/types';

@Controller()
export class ConsumersController implements OnModuleInit {
  constructor(private readonly handlePlanSubscriptionCreatedService: HandlePlanSubscriptionCreatedService) {}

  async onModuleInit() {
    if (configDto.eventsProvider !== 'kafka') return;

    const { kafkaTopicUserCreated } = configDto;

    const consumerGroupOptions = {
      clientId: configDto.kafkaClientId,
      groupId: configDto.kafkaGroupId,
      kafkaHost: configDto.kafkaBroker,
    };

    const topicSubscribers: ITopicSubscribers = {
      [kafkaTopicUserCreated]: async (topic: string, partition: number, message) => {
        console.log('subscribe');
        // await this.handlePlanSubscriptionCreatedService.execute(topic, partition, message),
      },
    };

    // TODO: implement consumer logic if necessary
    // await consumeMessages(topicSubscribers, consumerGroupOptions);
  }
}
