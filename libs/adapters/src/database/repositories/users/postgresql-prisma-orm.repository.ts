// users.repository.ts
import { USERS_ERROR_MESSAGES } from '@core/domains/users/constants/error-messages';
import { UserEntity } from '@core/domains/users/entities/user/entity';
import { UsersDatabaseRepository } from '@core/domains/users/repositories/database.repository';
import { CreateUserDto } from '@core/domains/users/services/create-user.dto';
import { PostgreSqlPrismaOrmService } from '../../infra/prisma/postgresql-prisma-orm.service';

import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class PostgreSqlPrismaOrmUsersDatabaseRepository implements UsersDatabaseRepository {
  constructor(private postgreSqlPrismaOrmService: PostgreSqlPrismaOrmService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email } = createUserDto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException(USERS_ERROR_MESSAGES['CONFLICTING_EMAIL']);
    }

    const prismaUser = await this.postgreSqlPrismaOrmService.users.create({
      data: { email },
    });
    const applicationUser = new UserEntity({
      email: prismaUser.email,
      id: prismaUser.id,
    });
    return applicationUser;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const prismaUser = await this.postgreSqlPrismaOrmService.users.findFirst({
      where: {
        email,
      },
    });
    if (!prismaUser) {
      return null;
    }

    const applicationUser = new UserEntity({
      email: prismaUser.email,
      id: prismaUser.id,
    });
    return applicationUser;
  }

  async findAll() {
    const prismaUsers = await this.postgreSqlPrismaOrmService.users.findMany();
    const applicationUsers = prismaUsers.map(
      (prismaUser) => new UserEntity({ email: prismaUser.email, id: prismaUser.id })
    );
    return applicationUsers;
  }
}
