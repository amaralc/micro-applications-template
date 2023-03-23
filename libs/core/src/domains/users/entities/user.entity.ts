import { randomUUID } from 'crypto';
import { Replace } from '../../../shared/helpers/replace';
import { UserDto } from './user.dto';

type IMakeUserProps = Replace<UserDto, { id?: string }>;

export class UserEntity extends UserDto {
  constructor({ id, email }: IMakeUserProps) {
    super();
    this.id = id ?? randomUUID();
    this.email = email;
  }
}
