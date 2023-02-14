// users.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infra/storage/prisma/prisma.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { UsersStorageRepository } from './users-storage.repository';

@Injectable()
export class PrismaUsersStorageRepository implements UsersStorageRepository {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const prismaUser = await this.prismaService.users.create({
      data: { email },
    });
    const applicationUser = new User(prismaUser.email);
    return applicationUser;
  }

  async findAll() {
    const prismaUsers = await this.prismaService.users.findMany();
    const applicationUsers = prismaUsers.map((user) => new User(user.email));
    return applicationUsers;
  }
}
