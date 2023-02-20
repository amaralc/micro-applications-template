import { ValidationException } from '../../../errors/validation-exception';
import { InMemoryEventsService } from '../../../infra/events/implementations/in-memory-events.service';
import { InMemoryUsersDatabaseRepository } from '../repositories/database/implementation/in-memory.repository';
import { InMemoryUsersEventsRepository } from '../repositories/events/implementation/in-memory.repository';
import { CreateUserService } from './create-user.service';

const setupTests = () => {
  const usersDatabaseRepository = new InMemoryUsersDatabaseRepository();
  const eventsService = new InMemoryEventsService();
  const usersEventsRepository = new InMemoryUsersEventsRepository(
    eventsService
  );
  const publish = jest.spyOn(usersEventsRepository, 'publishUserCreated');
  const createUserService = new CreateUserService(
    usersDatabaseRepository,
    usersEventsRepository
  );

  return {
    publish,
    createUserService,
  };
};

describe('[users] Create user', () => {
  it('should create and publish a new user', async () => {
    const { createUserService, publish } = setupTests();

    const userEmail = 'user@email.com';
    const { user } = await createUserService.execute({
      email: userEmail,
    });
    expect(user.email).toEqual(userEmail);
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledWith(user);
  });

  it('should not create nor publish a new user with an invalid e-mail', async () => {
    const { createUserService, publish } = setupTests();

    const userEmail = 'user';
    await expect(
      createUserService.execute({ email: userEmail })
    ).rejects.toThrow(ValidationException);
    expect(publish).toHaveBeenCalledTimes(0);
  });
});
