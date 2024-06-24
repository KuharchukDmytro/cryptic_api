import { PartialType } from '@nestjs/mapped-types';
import { CreateOnlineStatusDto } from './create-online-status.dto';

export class UpdateOnlineStatusDto extends PartialType(CreateOnlineStatusDto) {}
