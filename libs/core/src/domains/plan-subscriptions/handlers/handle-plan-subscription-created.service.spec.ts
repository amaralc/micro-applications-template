import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PlanSubscriptionCreatedMessageDto } from '../entities/plan-subscription-created-message/dto';
import { InMemoryPlanSubscriptionsDatabaseRepository } from '../repositories/database-in-memory.repository';
import { PlanSubscriptionsDatabaseRepository } from '../repositories/database.repository';
import { CreatePlanSubscriptionService } from '../services/create-plan-subscription.service';
import { HandlePlanSubscriptionCreatedService } from './handle-plan-subscription-created.service';

describe('[plan-subscriptions] HandlePlanSubscriptionCreatedService', () => {
  let handlePlanSubscriptionCreatedService: HandlePlanSubscriptionCreatedService;
  let createPlanSubscriptionService: CreatePlanSubscriptionService;
  let databaseRepository: PlanSubscriptionsDatabaseRepository;
  let execute: jest.SpyInstance;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandlePlanSubscriptionCreatedService,
        CreatePlanSubscriptionService,
        { provide: PlanSubscriptionsDatabaseRepository, useClass: InMemoryPlanSubscriptionsDatabaseRepository },
      ],
    }).compile();

    handlePlanSubscriptionCreatedService = module.get<HandlePlanSubscriptionCreatedService>(
      HandlePlanSubscriptionCreatedService
    );
    createPlanSubscriptionService = module.get<CreatePlanSubscriptionService>(CreatePlanSubscriptionService);
    databaseRepository = module.get<PlanSubscriptionsDatabaseRepository>(PlanSubscriptionsDatabaseRepository);
    execute = jest.spyOn(createPlanSubscriptionService, 'execute');
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

    expect(execute).not.toHaveBeenCalled();
  });

  it('should create plan subscription if payload is valid', async () => {
    const entity: PlanSubscriptionCreatedMessageDto = {
      id: randomUUID(),
      isActive: faker.datatype.boolean(),
      email: faker.internet.email(),
      plan: faker.lorem.slug(1),
    };

    await expect(handlePlanSubscriptionCreatedService.execute(entity)).resolves.not.toThrow();
    expect(execute).toHaveBeenCalledWith(entity);
    expect(databaseRepository.findByEmail);
  });
});
