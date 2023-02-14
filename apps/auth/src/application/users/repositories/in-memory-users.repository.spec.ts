import { InMemoryUsersRepository } from './in-memory-users.repository';

describe('UsersRepository', () => {
  it('should be defined', () => {
    expect(new InMemoryUsersRepository()).toBeDefined();
  });
});
