import { Body, Controller, Post } from '@nestjs/common';
import { GlobalAppHttpException } from '../../errors/global-app-http-exception';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserService } from './services/create-user.service';

@Controller('users')
export class UsersController {
  constructor(private createUsersService: CreateUserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.createUsersService.execute(createUserDto);
    } catch (e) {
      throw new GlobalAppHttpException(e);
    }
  }
}
