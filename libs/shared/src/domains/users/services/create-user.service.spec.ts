import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
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

  const shouldFailIfThisFunctionIsExecuted = () => {
    expect(true).toEqual(false);
  };

  return {
    publish,
    createUserService,
    shouldFailIfThisFunctionIsExecuted,
  };
};

describe('[users] Create user', () => {
  it('should create and publish a new user', async () => {
    const { createUserService, publish } = setupTests();
    const newUserEmail = faker.internet.email();
    const { user } = await createUserService.execute({
      email: newUserEmail,
    });
    expect(user.email).toEqual(newUserEmail);
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledWith(user);
  });

  it('should throw conflict exception if e-mail is already being used', async () => {
    const { createUserService, shouldFailIfThisFunctionIsExecuted } =
      setupTests();
    const newUserEmail = faker.internet.email();
    try {
      await createUserService.execute({
        email: newUserEmail,
      });
      await createUserService.execute({
        email: newUserEmail,
      });
      shouldFailIfThisFunctionIsExecuted();
    } catch (error) {
      expect(error instanceof ConflictException).toEqual(true);
    }
  });

  it('should throw validation exception if e-mail is not valid', async () => {
    const { createUserService, publish } = setupTests();
    const invalidUserEmail = 'invalid-user-email';
    try {
      await createUserService.execute({ email: invalidUserEmail });
      expect(true).toEqual(false);
    } catch (error) {
      expect(error instanceof ValidationException).toEqual(true);
      expect(publish).not.toHaveBeenCalled();
    }
  });
});
