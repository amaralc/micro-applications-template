import { faker } from '@faker-js/faker';
import { pagination } from '../../../config';
import { ValidationException } from '../../../errors/validation-exception';
import { InMemoryPlanSubscriptionsDatabaseRepository } from '../repositories/database-in-memory.repository';
import { ListPaginatedPlanSubscriptionsService } from './list-paginated-plan-subscriptions.service';

const setupTests = async () => {
  const planSubscriptionsDatabaseRepository = new InMemoryPlanSubscriptionsDatabaseRepository();
  const localPlanSubscriptions = [];

  for (let i = 0; i < 20; i++) {
    const planSubscription = await planSubscriptionsDatabaseRepository.create({
      email: faker.internet.email(),
      plan: faker.random.word(),
    });
    localPlanSubscriptions.push(planSubscription);
  }

  const listPaginatedPlanSubscriptionsService = new ListPaginatedPlanSubscriptionsService(
    planSubscriptionsDatabaseRepository
  );

  return { listPaginatedPlanSubscriptionsService, localPlanSubscriptions, planSubscriptionsDatabaseRepository };
};

describe('[plan-subscriptions] List paginated plan subscriptions', () => {
  it('should throw error if limit is invalid', async () => {
    const { listPaginatedPlanSubscriptionsService } = await setupTests();
    await expect(listPaginatedPlanSubscriptionsService.execute({ limit: -1, page: 1 })).rejects.toThrow(
      ValidationException
    );
  });
  it('should throw error if page is invalid', async () => {
    const { listPaginatedPlanSubscriptionsService } = await setupTests();
    await expect(listPaginatedPlanSubscriptionsService.execute({ limit: 1, page: 0 })).rejects.toThrow(
      ValidationException
    );
  });
  it('should list paginated plan subscriptions with default limit and page if not specified', async () => {
    const { listPaginatedPlanSubscriptionsService, localPlanSubscriptions } = await setupTests();
    const LIMIT = pagination.defaultLimit;
    const PAGE = pagination.defaultPage;

    const planSubscriptions = await listPaginatedPlanSubscriptionsService.execute({});
    const expectedPlanSubscriptions = [...localPlanSubscriptions].slice(PAGE - 1, LIMIT);

    expect(planSubscriptions.length).toBeLessThanOrEqual(LIMIT);
    expect(planSubscriptions).toEqual(expectedPlanSubscriptions);
  });
  it('should list paginated plan subscriptions given valid page and limit values', async () => {
    const { listPaginatedPlanSubscriptionsService } = await setupTests();
    const LIMIT = 5;
    const PAGE = 1;

    const planSubscriptions = await listPaginatedPlanSubscriptionsService.execute({ limit: LIMIT, page: PAGE });
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
  });
});
