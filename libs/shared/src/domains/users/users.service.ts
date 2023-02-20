import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserService } from './services/create-user.service';

@Injectable()
export class UsersService {
  constructor(private createUserService: CreateUserService) {}

  create(createUserDto: CreateUserDto) {
    return this.createUserService.execute(createUserDto);
  }
}
