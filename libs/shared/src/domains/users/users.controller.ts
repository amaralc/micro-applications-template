import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../../../../libs/shared/src/domains/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
