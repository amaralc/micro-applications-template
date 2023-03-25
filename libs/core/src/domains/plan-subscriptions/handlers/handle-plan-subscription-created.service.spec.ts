import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ApplicationLogger } from '../../../shared/logs/application-logger';
import { NativeLogger } from '../../../shared/logs/native-logger';
import { PlanSubscriptionCreatedMessageDto } from '../entities/plan-subscription-created-message/dto';
import { PlanSubscriptionEntity } from '../entities/plan-subscription/entity';
import { InMemoryPlanSubscriptionsDatabaseRepository } from '../repositories/database-in-memory.repository';
import { PlanSubscriptionsDatabaseRepository } from '../repositories/database.repository';
import { HandlePlanSubscriptionCreatedService } from './handle-plan-subscription-created.service';

describe('[plan-subscriptions] HandlePlanSubscriptionCreatedService', () => {
  let handlePlanSubscriptionCreatedService: HandlePlanSubscriptionCreatedService;
  let databaseRepository: PlanSubscriptionsDatabaseRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandlePlanSubscriptionCreatedService,
        { provide: ApplicationLogger, useClass: NativeLogger },
        { provide: PlanSubscriptionsDatabaseRepository, useClass: InMemoryPlanSubscriptionsDatabaseRepository },
      ],
    }).compile();

    handlePlanSubscriptionCreatedService = module.get<HandlePlanSubscriptionCreatedService>(
      HandlePlanSubscriptionCreatedService
    );
    databaseRepository = module.get<PlanSubscriptionsDatabaseRepository>(PlanSubscriptionsDatabaseRepository);
  });

  afterEach(async () => {
    await databaseRepository.deleteAll();
  });

  it('should throw validation exception if message payload is not valid', async () => {
    let payload;
    payload = { key: 'value' };
    await expect(handlePlanSubscriptionCreatedService.execute(payload)).rejects.toThrowError();

    payload = 'x';
    await expect(handlePlanSubscriptionCreatedService.execute(payload)).rejects.toThrowError();

    payload = '{"key":"value"}';
    await expect(handlePlanSubscriptionCreatedService.execute(payload)).rejects.toThrowError();

    payload = 1;
    await expect(handlePlanSubscriptionCreatedService.execute(payload)).rejects.toThrowError();

    await expect(databaseRepository.listPaginated({})).resolves.toEqual([]);
  });

  it('should create plan subscription if payload is valid', async () => {
    const entity: PlanSubscriptionCreatedMessageDto = {
      id: randomUUID(),
      isActive: faker.datatype.boolean(),
      email: faker.internet.email(),
      plan: faker.lorem.slug(1),
    };

    await expect(handlePlanSubscriptionCreatedService.execute(entity)).resolves.not.toThrow();
    await expect(databaseRepository.listPaginated({})).resolves.toEqual([new PlanSubscriptionEntity(entity)]);
  });
});
