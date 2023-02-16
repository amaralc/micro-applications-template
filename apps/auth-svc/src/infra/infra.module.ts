import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './events/kafka/kafka.service';
import { PrismaService } from './storage/prisma/prisma.service';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [KafkaService, PrismaService],
  exports: [KafkaService, PrismaService],
})
export class InfraModule {}
