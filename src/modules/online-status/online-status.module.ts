import { Module } from '@nestjs/common';
import { OnlineStatusService } from './online-status.service';
import { OnlineStatusController } from './online-status.controller';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  controllers: [OnlineStatusController],
  providers: [OnlineStatusService],
  imports: [WebsocketModule],
})
export class OnlineStatusModule {}
