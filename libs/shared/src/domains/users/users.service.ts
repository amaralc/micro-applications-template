import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserUseCase } from './use-cases/create-user.use-case';

@Injectable()
export class UsersService {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  create(createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }
}
