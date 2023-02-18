import { IsString } from 'class-validator';

export abstract class CreateUserDto {
  @IsString()
  email!: string;
}
