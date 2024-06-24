import { Module } from '@nestjs/common';
import { OnlineStatusService } from './online-status.service';
import { OnlineStatusController } from './online-status.controller';

@Module({
  controllers: [OnlineStatusController],
  providers: [OnlineStatusService],
})
export class OnlineStatusModule {}
