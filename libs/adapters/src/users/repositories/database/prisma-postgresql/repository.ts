// users.repository.ts
import { CreateUserDto } from '@core/domains/users/dto/create-user.dto';
import { UserEntity } from '@core/domains/users/entities/user.entity';
import { USERS_ERROR_MESSAGES } from '@core/domains/users/errors/error-messages';
import { UsersDatabaseRepository } from '@core/domains/users/repositories/database.repository';
import { PrismaService } from '@infra/storage/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class PrismaPostgreSqlUsersDatabaseRepository implements UsersDatabaseRepository {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email } = createUserDto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException(USERS_ERROR_MESSAGES['CONFLICT']['EMAIL_ALREADY_EXISTS']);
    }

    const prismaUser = await this.prismaService.users.create({
      data: { email },
    });
    const applicationUser = new UserEntity({
      email: prismaUser.email,
      id: prismaUser.id,
    });
    return applicationUser;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const prismaUser = await this.prismaService.users.findFirst({
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
    const prismaUsers = await this.prismaService.users.findMany();
    const applicationUsers = prismaUsers.map(
      (prismaUser) => new UserEntity({ email: prismaUser.email, id: prismaUser.id })
    );
    return applicationUsers;
  }
}
