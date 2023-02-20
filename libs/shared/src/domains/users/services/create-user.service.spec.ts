import { ValidationException } from '../../../errors/validation-exception';
import { InMemoryEventsService } from '../../../infra/events/implementations/in-memory-events.service';
import { InMemoryUsersDatabaseRepository } from '../repositories/database/implementation/in-memory.repository';
import { InMemoryUsersEventsRepository } from '../repositories/events/implementation/in-memory.repository';
import { CreateUserService } from './create-user.service';

describe('Create User', () => {
  it('should create a new user', async () => {
    const usersDatabaseRepository = new InMemoryUsersDatabaseRepository();

    const eventsService = new InMemoryEventsService();
    const usersEventsRepository = new InMemoryUsersEventsRepository(
      eventsService
    );

    const createUserService = new CreateUserService(
      usersDatabaseRepository,
      usersEventsRepository
    );

    const userEmail = 'user@email.com';
    const { user } = await createUserService.execute({
      email: userEmail,
    });
    expect(user.email).toEqual(userEmail);
  });

  it('should not create a new user with an invalid e-mail', async () => {
    const usersDatabaseRepository = new InMemoryUsersDatabaseRepository();

    const eventsService = new InMemoryEventsService();
    const usersEventsRepository = new InMemoryUsersEventsRepository(
      eventsService
    );

    const createUserService = new CreateUserService(
      usersDatabaseRepository,
      usersEventsRepository
    );

    const userEmail = 'user';
    await expect(
      createUserService.execute({ email: userEmail })
    ).rejects.toThrow(ValidationException);
  });
});
