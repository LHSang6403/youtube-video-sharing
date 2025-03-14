import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(NotificationsGateway.name);

  sendNotification(notification: { title: string; sharedBy: string }) {
    this.logger.log(
      `Sending notification: ${notification.title} shared by ${notification.sharedBy}`,
    );
    this.server.emit('newVideo', notification);
  }
}
