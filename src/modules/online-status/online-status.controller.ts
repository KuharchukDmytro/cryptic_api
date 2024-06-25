import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { OnlineStatusService } from './online-status.service';

@UseGuards(AuthGuard)
@Controller('online-status')
export class OnlineStatusController {
  constructor(private readonly onlineStatusService: OnlineStatusService) {}

  @Post()
  create(@Req() req: RequestWithUser) {
    return this.onlineStatusService.create({
      data: {
        userId: req.currentUserId,
      },
    });
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.onlineStatusService.findAll({
      where: { userId: req.currentUserId },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.onlineStatusService.findOne({
      where: { id: Number(id) },
    });
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateOnlineStatusDto: UpdateOnlineStatusDto,
  // ) {
  //   return this.onlineStatusService.update({
  //     where: {
  //       id: Number(id),
  //     },
  //     data: updateOnlineStatusDto,
  //   });
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.onlineStatusService.remove(Number(id));
  }
}
