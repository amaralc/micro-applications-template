import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../entities/user.entity';

export abstract class UsersStorageRepository {
  abstract create(createUserDto: CreateUserDto): Promise<User>;
  abstract findAll(): Promise<Array<User>>;
  abstract findByEmail(email: string): Promise<User | null>;
}
