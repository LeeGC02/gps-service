//puertos y configuracion
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ParsedGpsLocation } from '../interfaces/parsed-gps-location.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class GpsGateway {
  @WebSocketServer()
  server!: Server;
  // Envía ubicación al frontend (solo pruebas)
  emitLocation(location: ParsedGpsLocation) {
    this.server.emit('gps:location', location);
  }
}