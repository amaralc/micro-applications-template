import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MainModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MainModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'plan-subscription', // plan-subscription-server
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'plan-subscription',
        },
      },
    }
  );
  await app.listen();
  Logger.log(`🚀 Application is running ...`);
}

bootstrap();
