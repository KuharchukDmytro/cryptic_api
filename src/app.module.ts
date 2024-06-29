import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { NodemailerModule } from './modules/nodemailer/nodemailer.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { UserModule } from './modules/user/user.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { OnlineStatusModule } from './modules/online-status/online-status.module';
import { MessageModule } from './modules/message/message.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DatabaseModule,
    RefreshTokenModule,
    NodemailerModule,
    OnlineStatusModule,
    ConversationModule,
    MessageModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
