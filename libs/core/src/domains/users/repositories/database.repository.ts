import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';

// Abstraction
export abstract class UsersDatabaseRepository {
  abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;
  abstract findAll(): Promise<Array<UserEntity>>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
