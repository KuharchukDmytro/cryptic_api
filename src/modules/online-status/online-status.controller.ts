import {
  Body,
  Controller,
  Delete,
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
import { OnlineStatusService } from './online-status.service';
import { UpdateOnlineStatusDto } from './dto/update-online-status.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { OnlineStatusWithRelations } from './types/online-status-with-relations.type';

@UseGuards(AuthGuard)
@Controller('online-status')
export class OnlineStatusController {
  constructor(
    private readonly onlineStatusService: OnlineStatusService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.onlineStatusService.findOne({
      where: { id },
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOnlineStatusDto: UpdateOnlineStatusDto,
  ) {
    const { user, ...updatedStatus } = (await this.onlineStatusService.update({
      where: {
        id,
      },
      data: updateOnlineStatusDto,
      include: {
        user: {
          select: {
            uuid: true,
          },
        },
      },
    })) as OnlineStatusWithRelations;

    this.websocketGateway.emitEvent('onlineStatusUpdated', {
      uuid: user.uuid,
      status: updatedStatus.status,
    });

    return updatedStatus;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.onlineStatusService.remove(id);
  }
}
