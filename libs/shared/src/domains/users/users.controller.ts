import { Body, Controller, Post } from '@nestjs/common';
import { GlobalAppHttpException } from '../../errors/global-app-http-exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (e) {
      throw new GlobalAppHttpException(e);
    }
  }
}
