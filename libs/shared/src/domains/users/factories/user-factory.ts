import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

type Override = Partial<CreateUserDto>;

export function makeMockUser(override: Override) {
  return new User({
    email: 'user@email.com',
    ...override,
  });
}
