import { PrismaService } from '../../../infra/storage/prisma/prisma.service';
import { PrismaUsersRepository } from './prisma-users.repository';

describe('UsersRepository', () => {
  it('should be defined', () => {
    expect(new PrismaUsersRepository(new PrismaService())).toBeDefined();
  });
});
