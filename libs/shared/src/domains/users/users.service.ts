import { Injectable } from '@nestjs/common';
import { GlobalAppHttpException } from '../../errors/global-app-http-exception';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserUseCase } from './use-cases/create-user.use-case';

@Injectable()
export class UsersService {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.createUserUseCase.execute(createUserDto);
      return user;
    } catch (e) {
      throw new GlobalAppHttpException(e);
    }
  }
}
