import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  UsersRepository,
  UsersRepositoryImplementation,
} from './application/users/repositories/users.repository';
import { UsersController } from './application/users/users.controller';
import { UsersService } from './application/users/users.service';
import { KafkaService } from './infra/events/kafka/kafka.service';
import { PrismaService } from './infra/storage/prisma/prisma.service';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
  ],
  controllers: [UsersController],
  providers: [
    KafkaService,
    PrismaService,
    UsersService,
    {
      provide: UsersRepository,
      useClass: UsersRepositoryImplementation,
    },
  ],
})
export class RootModule {}
