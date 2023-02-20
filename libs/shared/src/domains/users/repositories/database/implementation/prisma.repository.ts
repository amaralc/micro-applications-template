// users.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../infra/storage/prisma/prisma.service';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { User } from '../../../entities/user.entity';
import { USERS_ERROR_MESSAGES } from '../../../errors/error-messages';
import { UsersDatabaseRepository } from '../database.repository';

@Injectable()
export class PrismaUsersDatabaseRepository implements UsersDatabaseRepository {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException(
        USERS_ERROR_MESSAGES['CONFLICT_EMAIL_ALREADY_EXIST']
      );
    }

    const prismaUser = await this.prismaService.users.create({
      data: { email },
    });
    const applicationUser = new User(prismaUser.email);
    return applicationUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prismaService.users.findFirst({
      where: {
        email,
      },
    });
    if (!prismaUser) {
      return null;
    }

    const applicationUser = new User(prismaUser.email);
    return applicationUser;
  }

  async findAll() {
    const prismaUsers = await this.prismaService.users.findMany();
    const applicationUsers = prismaUsers.map((user) => new User(user.email));
    return applicationUsers;
  }
}
