// users.repository.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infra/storage/prisma/prisma.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { UsersStorageRepository } from './users-storage.repository';

@Injectable()
export class PrismaUsersStorageRepository implements UsersStorageRepository {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const userExists = this.findByEmail(email);
    if (userExists) {
      throw new ConflictException('This e-mail is already taken');
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
