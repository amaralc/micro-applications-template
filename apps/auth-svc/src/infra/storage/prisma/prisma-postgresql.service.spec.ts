import { Test, TestingModule } from '@nestjs/testing';
import { PrismaPostgreSQLService } from './prisma-postgresql.service';

describe('PrismaPostgreSQLService', () => {
  let service: PrismaPostgreSQLService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaPostgreSQLService],
    }).compile();

    service = module.get<PrismaPostgreSQLService>(PrismaPostgreSQLService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
