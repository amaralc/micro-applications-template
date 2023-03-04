import { CreateUserDto } from '@core/domains/users/dto/create-user.dto';
import { CreateUserService } from '@core/domains/users/services/create-user.service';
import { GlobalAppHttpException } from '@core/errors/global-app-http-exception';
import { Body, Controller, Post } from '@nestjs/common';

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
