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
import { RequestWithUser } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

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
        hasStarted: true,
      },
      include: {
        participants: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne({
      where: { id },
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    { participants, ...rest }: UpdateConversationDto,
  ) {
    return this.conversationService.update({
      where: { id },
      data: {
        ...rest,
        participants: {
          connect: participants?.map((id) => ({ id })),
        },
      },
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove({
      where: { id },
    });
  }
}
