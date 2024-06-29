import { Message } from '@prisma/client';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMessageDto
  implements Omit<Message, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsNumber()
  senderId: number;

  @IsUUID()
  conversationId: string;

  @IsBoolean()
  @IsOptional()
  isEdited: boolean;

  @IsString()
  message: string;
}
