import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from 'express';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getMe(@Req() req: RequestWithUser) {
    return await this.userService.getOne({
      where: { id: req.currentUserId },
    });
  }

  @Get('/all')
  async getAll() {
    return await this.userService.getAll();
  }

  @Post()
  async createUser(@Body() userCreateInput: CreateUserDto) {
    return await this.userService.create({ data: userCreateInput });
  }
}
