import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from './events/kafka/kafka.service';
import { PrismaPostgreSQLService } from './storage/prisma/prisma-postgresql.service';

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
  providers: [KafkaService, PrismaPostgreSQLService],
  exports: [KafkaService, PrismaPostgreSQLService],
})
export class InfraModule {}
