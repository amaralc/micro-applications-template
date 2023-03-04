import { IsEmail, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID()
  id!: string;

  @IsEmail()
  email!: string;
}
