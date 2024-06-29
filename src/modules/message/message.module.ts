import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [WebsocketModule],
})
export class MessageModule {}
