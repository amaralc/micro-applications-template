import { InMemoryUsersDatabaseRepository } from '@core/domains/users/repositories/database-in-memory.repository';
import { UsersDatabaseRepository } from '@core/domains/users/repositories/database.repository';
import { PrismaService } from '@infra/database/prisma.service';
import { IDatabaseProvider } from '@infra/database/types';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseUser, MongooseUserSchema } from './mongoose-mongodb.entity';
import { MongooseMongoDbUsersDatabaseRepository } from './mongoose-mongodb.repository';
import { PrismaPostgreSqlUsersDatabaseRepository } from './prisma-postgres.repository';

@Module({})
export class UsersDatabaseRepositoryModule {
  // Initialize repository
  static register({ provider }: { provider: IDatabaseProvider }): DynamicModule {
    let dynamicImports: Array<DynamicModule> = [];
    let dynamicProviders: Array<Provider> = [];

    if (provider === 'mongodb') {
      dynamicImports = [
        MongooseModule.forFeature([
          {
            name: MongooseUser.name,
            schema: MongooseUserSchema,
          },
        ]),
      ];

      dynamicProviders = [
        {
          provide: UsersDatabaseRepository,
          useClass: MongooseMongoDbUsersDatabaseRepository,
        },
      ];
    }

    if (provider === 'postgresql') {
      dynamicProviders = [
        PrismaService,
        {
          provide: UsersDatabaseRepository,
          useClass: PrismaPostgreSqlUsersDatabaseRepository,
        },
      ];
    }

    if (provider === 'memory') {
      dynamicProviders = [
        PrismaService,
        {
          provide: UsersDatabaseRepository,
          useClass: InMemoryUsersDatabaseRepository,
        },
      ];
    }

    return {
      module: UsersDatabaseRepositoryModule,
      imports: [...dynamicImports],
      providers: [...dynamicProviders],
      exports: [...dynamicProviders],
    };
  }
}
