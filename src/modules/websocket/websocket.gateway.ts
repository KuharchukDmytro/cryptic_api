import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitEvent(event: string, data: any) {
    this.server.emit(event, data);
  }

  emitToUser(userUUID: string, event: string, data: any) {
    this.server.to(userUUID).emit(event, data);
  }

  @SubscribeMessage('joinRoom')
  joinUserRoom(
    @MessageBody() userUUID: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Client ${client.id} joined room ${userUUID}`);

    client.join(userUUID);
  }

  @SubscribeMessage('leaveRoom')
  leaveUserRoom(
    @MessageBody() userUUID: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Client ${client.id} leaved room ${userUUID}`);

    client.leave(userUUID);
  }
}
