import { IsEmail, IsString } from 'class-validator';

export class UserCreatedMessageValue {
  @IsString()
  id!: string;

  @IsEmail()
  email!: string;
}
