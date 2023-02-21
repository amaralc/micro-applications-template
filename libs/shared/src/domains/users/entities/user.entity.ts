import { randomUUID } from 'crypto';
import { CreateUserDto } from '../dto/create-user.dto';

export interface IUserProps {
  id: string;
  email: string;
}

export class User {
  id: IUserProps['id'];
  email: IUserProps['email'];

  constructor(createUserDto: CreateUserDto) {
    this.id = randomUUID();
    this.email = createUserDto.email;
  }
}
