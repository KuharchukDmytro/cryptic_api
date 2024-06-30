import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

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

  @Get('/search-by-username')
  search(@Req() req: RequestWithUser) {
    const username = req.query.username as string;

    return this.userService.getAll({
      where: {
        username: {
          contains: username,
        },
      },
      select: {
        id: true,
        uuid: true,
        email: true,
        username: true,
        avatarUrl: true,
        onlineStatus: true,
        conversations: {
          where: {
            participants: {
              some: {
                id: req.currentUserId,
              },
            },
          },
          include: {
            messages: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });
  }

  @Post()
  async createUser(@Body() userCreateInput: CreateUserDto) {
    return await this.userService.create({ data: userCreateInput });
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userUpdateInput: UpdateUserDto,
  ) {
    return await this.userService.update({
      where: { id },
      data: userUpdateInput,
    });
  }
}
