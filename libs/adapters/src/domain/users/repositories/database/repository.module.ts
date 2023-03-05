import { InMemoryUsersDatabaseRepository } from '@core/domains/users/repositories/database-in-memory.repository';
import { UsersDatabaseRepository } from '@core/domains/users/repositories/database.repository';
import { DatabaseModule } from '@infra/database/database.module';
import { IDatabaseProvider } from '@infra/database/types';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseUser, MongooseUserSchema } from './mongoose-mongodb.entity';
import { MongooseMongoDbUsersDatabaseRepository } from './mongoose-mongodb.repository';
import { PrismaPostgreSqlUsersDatabaseRepository } from './prisma-postgres.repository';

@Module({})
export class UsersDatabaseRepositoryModule {
  // Get the repository implementation based on the provider
  static getRepositoryImplementation({ provider }: { provider: IDatabaseProvider }): Provider {
    const repositoryImplementations = {
      memory: InMemoryUsersDatabaseRepository,
      mongodb: MongooseMongoDbUsersDatabaseRepository,
      postgresql: PrismaPostgreSqlUsersDatabaseRepository,
    };

    return {
      provide: UsersDatabaseRepository,
      useClass: repositoryImplementations[provider],
    };
  }

  // Initialize repository
  static forRoot({ provider }: { provider: IDatabaseProvider }): DynamicModule {
    return {
      module: UsersDatabaseRepositoryModule,
      imports: [
        DatabaseModule,
        MongooseModule.forFeature([
          {
            name: MongooseUser.name,
            schema: MongooseUserSchema,
          },
        ]),
      ],
      providers: [this.getRepositoryImplementation({ provider })],
      exports: [this.getRepositoryImplementation({ provider })],
    };
  }
}
