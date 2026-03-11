//puertos y configuracion
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { GpsData } from './gt06.decoder';
@WebSocketGateway({ cors: true})
export class GpsGateway {
  @WebSocketServer()
  server: Server;

  // emite ubicacion a tiempo real a todos los clientes REACT conectados
  emitLocation(data: GpsData): void{
    this.server.emit('gps:location', data);
  }
}