import { UserEntity } from '../entities/user/entity';
import { CreateUserDto } from '../services/create-user.dto';

// Abstraction
export abstract class UsersDatabaseRepository {
  abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;
  abstract findAll(): Promise<Array<UserEntity>>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
