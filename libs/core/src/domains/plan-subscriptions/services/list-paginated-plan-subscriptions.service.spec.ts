import { ApplicationLogger } from '@core/shared/logs/application-logger';
import { NativeLogger } from '@core/shared/logs/native-logger';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { pagination } from '../../../shared/config';
import { ValidationException } from '../../../shared/errors/validation-exception';
import { PlanSubscriptionEntity } from '../entities/plan-subscription/entity';
import { InMemoryPlanSubscriptionsDatabaseRepository } from '../repositories/database-in-memory.repository';
import { PlanSubscriptionsDatabaseRepository } from '../repositories/database.repository';
import { CreatePlanSubscriptionService } from './create-plan-subscription.service';
import { ListPaginatedPlanSubscriptionsService } from './list-paginated-plan-subscriptions.service';

describe('[plan-subscriptions] ListPaginatedPlanSubscriptions', () => {
  let listPaginatedPlanSubscriptionsService: ListPaginatedPlanSubscriptionsService;
  let databaseRepository: PlanSubscriptionsDatabaseRepository;
  const repositoryPlanSubscriptions: PlanSubscriptionEntity[] = [];

  beforeAll(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListPaginatedPlanSubscriptionsService,
        CreatePlanSubscriptionService,
        { provide: ApplicationLogger, useClass: NativeLogger },
        { provide: PlanSubscriptionsDatabaseRepository, useClass: InMemoryPlanSubscriptionsDatabaseRepository },
      ],
    }).compile();

    listPaginatedPlanSubscriptionsService = module.get<ListPaginatedPlanSubscriptionsService>(
      ListPaginatedPlanSubscriptionsService
    );
    databaseRepository = module.get<PlanSubscriptionsDatabaseRepository>(PlanSubscriptionsDatabaseRepository);

    for (let i = 0; i < 20; i++) {
      const planSubscription = await databaseRepository.create({
        email: faker.internet.email(),
        plan: faker.random.word(),
      });
      repositoryPlanSubscriptions.push(planSubscription);
    }
  });

  it('should throw error for invalid pagination parameters', async () => {
    await expect(listPaginatedPlanSubscriptionsService.execute({ limit: -1, page: 1 })).rejects.toThrow(
      ValidationException
    );
    await expect(listPaginatedPlanSubscriptionsService.execute({ limit: 1, page: 0 })).rejects.toThrow(
      ValidationException
    );

    const invalidParameters = JSON.parse(JSON.stringify({ limit: 'x', page: 'y' }));
    await expect(listPaginatedPlanSubscriptionsService.execute(invalidParameters)).rejects.toThrow(ValidationException);
  });

  it('should list paginated plan subscriptions with default limit and page if not specified', async () => {
    const LIMIT = pagination.defaultLimit;
    const PAGE = pagination.defaultPage;

    const planSubscriptions = await listPaginatedPlanSubscriptionsService.execute({});
    const localPlanSubscriptions = [...repositoryPlanSubscriptions];
    const expectedPlanSubscriptions = localPlanSubscriptions.slice(PAGE - 1, LIMIT);

    expect(planSubscriptions.length).toBeLessThanOrEqual(LIMIT);
    expect(planSubscriptions).toEqual(expectedPlanSubscriptions);
  });

  it('should list paginated plan subscriptions given valid page and limit values', async () => {
    const LIMIT = 5;
    const PAGE = 1;

    const planSubscriptions = await listPaginatedPlanSubscriptionsService.execute({ limit: LIMIT, page: PAGE });
    const localPlanSubscriptions = [...repositoryPlanSubscriptions];
    const expectedPlanSubscriptions = localPlanSubscriptions.slice(PAGE - 1, LIMIT);

    expect(planSubscriptions.length).toBeLessThanOrEqual(5);
    expect(planSubscriptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          isActive: expect.any(Boolean),
          email: expect.stringMatching(/.+@.+..+/),
          plan: expect.any(String),
        }),
      ])
    );
    expect(planSubscriptions).toEqual(expectedPlanSubscriptions);
  });
});
