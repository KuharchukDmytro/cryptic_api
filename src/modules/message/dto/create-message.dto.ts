import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMessageDto
  implements Omit<Prisma.MessageCreateInput, 'conversation' | 'sender'>
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
