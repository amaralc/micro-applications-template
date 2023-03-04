import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationException } from '../../../errors/validation-exception';
import { InMemoryUsersDatabaseRepository } from '../repositories/database-in-memory.repository';
import { UsersDatabaseRepository } from '../repositories/database.repository';
import { InMemoryUsersEventsRepository } from '../repositories/events-in-memory.repository';
import { UsersEventsRepository } from '../repositories/events.repository';
import { CreateUserService } from './create-user.service';

describe('[users] CreateUserService', () => {
  let service: CreateUserService;
  let databaseRepository: UsersDatabaseRepository;
  let eventsRepository: UsersEventsRepository;
  let publishUserCreated: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        { provide: UsersDatabaseRepository, useClass: InMemoryUsersDatabaseRepository },
        { provide: UsersEventsRepository, useClass: InMemoryUsersEventsRepository },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    databaseRepository = module.get<UsersDatabaseRepository>(UsersDatabaseRepository);
    eventsRepository = module.get<UsersEventsRepository>(UsersEventsRepository);
    publishUserCreated = jest.spyOn(eventsRepository, 'publishUserCreated');
  });

  it('should create and publish a new user', async () => {
    const newUserEmail = faker.internet.email();
    const { user } = await service.execute({
      email: newUserEmail,
    });

    const databaseRepositoryUser = await databaseRepository.findByEmail(newUserEmail);

    expect(databaseRepositoryUser?.email).toEqual(newUserEmail);
    expect(user.email).toEqual(newUserEmail);
    expect(publishUserCreated).toHaveBeenCalledTimes(1);
    expect(publishUserCreated).toHaveBeenCalledWith(user);
  });

  it('should throw conflict exception if e-mail is already being used', async () => {
    const newUserEmail = faker.internet.email();
    await service.execute({
      email: newUserEmail,
    });

    await expect(
      service.execute({
        email: newUserEmail,
      })
    ).rejects.toThrow(ConflictException);
  });

  it('should throw validation exception if e-mail is not valid', async () => {
    const invalidUserEmail = 'invalid-user-email';
    await expect(service.execute({ email: invalidUserEmail })).rejects.toThrow(ValidationException);
  });
});
