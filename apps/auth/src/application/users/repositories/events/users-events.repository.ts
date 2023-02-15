import { User } from '../../entities/user.entity';

export abstract class UsersEventsRepository {
  abstract publishUserCreated(user: User): Promise<void>;
}
