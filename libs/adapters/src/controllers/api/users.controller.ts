import { CreateUserDto } from '@core/domains/users/services/create-user.dto';
import { CreateUserService } from '@core/domains/users/services/create-user.service';
import { GlobalAppHttpException } from '@core/shared/errors/global-app-http-exception';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersRestController {
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
