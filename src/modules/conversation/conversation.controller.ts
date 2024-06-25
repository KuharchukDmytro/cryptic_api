import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from 'express';

@UseGuards(AuthGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('/create')
  create(@Body() { participants, ...rest }: CreateConversationDto) {
    return this.conversationService.create({
      data: {
        ...rest,
        participants: {
          connect: participants.map((id) => ({ id })),
        },
      },
    });
  }

  @Get('/all')
  findAll(@Req() req: RequestWithUser) {
    return this.conversationService.findAll({
      where: {
        participants: {
          some: {
            id: req.currentUserId,
          },
        },
      },
      include: {
        participants: true,
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.conversationService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(+id);
  }
}
