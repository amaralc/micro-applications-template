import { EventsConfigDto } from '@adapters/repositories/events/events-config.dto';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MainModule } from './main.module';

const eventsConfigDto = new EventsConfigDto();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MainModule,
    eventsConfigDto.kafka && {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: eventsConfigDto.kafka.clientId,
          brokers: [eventsConfigDto.kafka.broker],
        },
        consumer: {
          groupId: eventsConfigDto.kafka.consumerGroupId,
        },
      },
    }
    // {
    //   /**
    //    * Custom transporters
    //    *
    //    * Docs: @see https://docs.nestjs.com/microservices/custom-transport
    //    * Articles:
    //    *  - @see https://dev.to/nestjs/integrate-nestjs-with-external-services-using-microservice-transporters-part-1-p3
    //    *  - @see https://dev.to/johnbiundo/series/4724
    //    *  - @see https://dev.to/nestjs/part-1-introduction-and-setup-1a2l
    //    * Implementation: @see https://github.com/nestjs/nest/issues/3083#issuecomment-1077456005
    //    */

    //   strategy: new KafkaCustomTransport({
    //     client: {
    //       clientId: 'plan-subscription', // plan-subscription-server
    //       brokers: ['localhost:9092'],
    //     },
    //     consumer: {
    //       groupId: 'plan-subscription',
    //     },
    //   }),
    // }
  );
  await app.listen();
  Logger.log(`🚀 Application is running ...`);
}

bootstrap();
