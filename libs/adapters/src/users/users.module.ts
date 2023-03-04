import { MongooseUser, MongooseUserSchema } from '@core/domains/users/entities/user.entity';
import { UsersDatabaseRepository } from '@core/domains/users/repositories/database.repository';
import { UsersEventsRepository } from '@core/domains/users/repositories/events.repository';
import { CreateUserService } from '@core/domains/users/services/create-user.service';
import { InfraModule } from '@infra/infra.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersDatabaseRepositoryImplementation } from './repositories/database/implementation/database.repository';
import { UsersEventsRepositoryImplementation } from './repositories/events/events.repository';
import { UsersController } from './users.controller';

@Module({
  imports: [
    /**
     * Use config module to expose environment variables
     * @see https://docs.nestjs.com/techniques/configuration
     *
     */
    ConfigModule.forRoot(),
    InfraModule,
    MongooseModule.forFeature([
      {
        name: MongooseUser.name,
        schema: MongooseUserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    CreateUserService,
    {
      provide: UsersDatabaseRepository,
      useClass: UsersDatabaseRepositoryImplementation,
    },
    {
      provide: UsersEventsRepository,
      useClass: UsersEventsRepositoryImplementation,
    },
  ],
  exports: [CreateUserService],
})
export class UsersModule {}
