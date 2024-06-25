import { Conversation } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreateConversationDto
  implements Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsBoolean()
  @IsOptional()
  isGroupConversation: boolean;

  @IsArray()
  @Type(() => Number)
  participants: number[];
}
