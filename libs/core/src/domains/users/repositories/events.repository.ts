import { UserEntity } from '../entities/user/entity';

// Abstraction
export abstract class UsersEventsRepository {
  abstract publishUserCreated(userEntity: UserEntity): Promise<void>;
}
