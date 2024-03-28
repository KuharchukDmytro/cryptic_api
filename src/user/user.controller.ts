import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userCreateInput: CreateUserDto) {
    return await this.userService.createUser(userCreateInput);
  }
}
