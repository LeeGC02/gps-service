// escuacha el gps st-901 por tcp
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as net from 'net';
import { GpsService } from './gps.service';
import { GpsGateway } from './gps.gateway';
import { decodeGT06, buildLoginResponse } from './gt06.decoder';

@Injectable()
export class TcpServer implements OnModuleInit {
  constructor(
    private readonly gpsService: GpsService,
    private readonly gpsGateway: GpsGateway,
  ) {}
  onModuleInit() {
    const server = net.createServer((socket) => {
      const deviceId = `${socket.remoteAddress}:${socket.remotePort}`;
      console.log(`🔌 GPS conectado: ${deviceId}`);

      socket.on('data', (buffer: Buffer) => {
        // si es paquete de login, responder confirmacion
        if (buffer[3] === 0x01) {
          socket.write(buildLoginResponse());
          console.log(`✅ Login confirmado: ${deviceId}`);
          return;
        }

        // Decodificar paquete de ubicación
        const gpsData = decodeGT06(buffer, deviceId);
        if (gpsData) {
          this.gpsService.saveLocation(gpsData);
          this.gpsGateway.emitLocation(gpsData);
        }
      });
      socket.on('close',() => {
        console.log(`❌ GPS desconectado: ${deviceId}`);      
      });
      socket.on('error', (err) => {
        console.error(`⚠️ Error en socket ${deviceId}:`, err.message);
      });
    });
    server.listen(5000, () => {
      console.log('📡 Servidor TCP escuchando en puerto 5000 para GPS ST-901');
    });
  }
}