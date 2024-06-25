import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'conversation',
  pingTimeout: 1800000,
})
export class ConversationGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor() {}

  afterInit() {
    console.log('Socket.io server initialized');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body) {
    console.log('🚀 ~ ConversationGateway ~ handleMessage ~ body:', body);

    this.server.emit('response-message', body);
  }
}
