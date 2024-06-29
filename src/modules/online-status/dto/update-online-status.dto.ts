import { Status } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateOnlineStatusDto {
  @IsEnum(Status)
  status?: Status;
}
