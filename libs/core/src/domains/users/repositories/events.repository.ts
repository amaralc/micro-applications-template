import { User } from '../entities/user.entity';

// Abstraction
export abstract class UsersEventsRepository {
  abstract publishUserCreated(user: User): Promise<void>;
}
