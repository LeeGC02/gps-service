import { Injectable, OnModuleInit } from '@nestjs/common';
import * as net from 'net';
import { GpsService } from './gps.service';
import { GpsGateway } from './gps.gateway';
import { decodeGT06, buildLoginResponse } from './gt06.decoder';
import { decodeST901Ascii } from './st901.decoder';

@Injectable()
export class TcpServer implements OnModuleInit {
  constructor(
    private readonly gpsService: GpsService,
    private readonly gpsGateway: GpsGateway,
  ) {}

  onModuleInit() {
    const server = net.createServer((socket) => {
      const connectionId = `${socket.remoteAddress}:${socket.remotePort}`;
      console.log(`🔌 GPS conectado: ${connectionId}`);

      socket.on('data', (buffer: Buffer) => {
        console.log('📦 BUFFER RAW:', buffer);
        console.log('📦 HEX:', buffer.toString('hex'));
        console.log('📦 LENGTH:', buffer.length);

        const text = buffer.toString('ascii').trim();
        console.log('📨 ASCII:', text);

        // 1) Primero intentar ST-901 ASCII
        if (text.startsWith('*HQ,') && text.endsWith('#')) {
          const gpsData = decodeST901Ascii(text);
          if (gpsData) {
            this.gpsService.saveLocation(gpsData);
            this.gpsGateway.emitLocation(gpsData);

            if (gpsData.status === 'A') {
              console.log('🟢 Ubicación válida en tiempo real:', gpsData);
            } else {
              console.log('🟠 Última ubicación guardada (sin fix GPS):', gpsData);
            }

          } else {
            console.log('⚠️ No se pudo decodificar paquete ASCII ST-901');
          }

          return;
        }

        // 2) Fallback por si entra GT06 binario
        if (buffer[0] === 0x78 && buffer[1] === 0x78) {
          if (buffer[3] === 0x01) {
            socket.write(buildLoginResponse());
            console.log(`✅ Login GT06 confirmado: ${connectionId}`);
            return;
          }

          const gpsData = decodeGT06(buffer, connectionId);
          if (gpsData) {
            this.gpsService.saveLocation(gpsData);
            this.gpsGateway.emitLocation(gpsData);
            console.log('📍 Ubicación GT06 guardada:', gpsData);
          } else {
            console.log('⚠️ Paquete GT06 no decodificado');
          }
          return;
        }

        console.log('⚠️ Formato de paquete no reconocido');
      });

      socket.on('close', () => {
        console.log(`❌ GPS desconectado: ${connectionId}`);
      });

      socket.on('error', (err) => {
        console.error(`⚠️ Error en socket ${connectionId}:`, err.message);
      });
    });

    server.listen(5000, () => {
      console.log('📡 Servidor TCP escuchando en puerto 5000 para GPS ST-901');
    });
  }
}