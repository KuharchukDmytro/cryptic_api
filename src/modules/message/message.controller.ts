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
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './message.service';
import { MessageWithRelations } from './types/message-with-relations';

@UseGuards(AuthGuard)
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    const message = (await this.messageService.create({
      data: createMessageDto,
      include: {
        sender: {
          select: {
            id: true,
            uuid: true,
            email: true,
            username: true,
            avatarUrl: true,
          },
        },
        conversation: {
          select: {
            participants: {
              select: {
                id: true,
                uuid: true,
                email: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        media: true,
      },
    })) as MessageWithRelations;

    this.websocketGateway.emitToUser(
      message.conversation.participants.filter(
        (part) => part.uuid !== message.sender.uuid,
      )[0].uuid,
      'newMessage',
      message,
    );

    return message;
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.messageService.findAll({
      where: {
        conversation: {
          participants: {
            some: {
              id: req.currentUserId,
            },
          },
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
          },
        },
        media: true,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.messageService.findOne({
      where: {
        id,
        sender: {
          id: req.currentUserId,
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
          },
        },
        media: true,
      },
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
    @Req() req: RequestWithUser,
  ) {
    return this.messageService.update({
      where: {
        id,
        sender: {
          id: req.currentUserId,
        },
      },
      data: { ...updateMessageDto, isEdited: true },
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.messageService.remove({
      where: {
        id,
        sender: {
          id: req.currentUserId,
        },
      },
    });
  }
}
