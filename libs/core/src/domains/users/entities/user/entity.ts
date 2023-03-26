import { randomUUID } from 'crypto';
import { Replace } from '../../../../shared/utils/replace';
import { UserDto } from './dto';

type IMakeUserProps = Replace<UserDto, { id?: string }>;

export class UserEntity extends UserDto {
  constructor({ id, email }: IMakeUserProps) {
    super();
    this.id = id ?? randomUUID();
    this.email = email;
  }
}
