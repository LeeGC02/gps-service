import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import * as net from 'net';
import { GpsParserService } from './gps-parser.service';
import { GpsService } from './gps.service';

@Injectable()
export class GpsTcpServer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GpsTcpServer.name);
  private server: net.Server | null = null;

  constructor(
    private readonly gpsParserService: GpsParserService,
    private readonly gpsService: GpsService,
  ) {}

  onModuleInit() {
    const port = Number(process.env.GPS_TCP_PORT || 5000);

    this.server = net.createServer((socket) => {
      const remote = `${socket.remoteAddress}:${socket.remotePort}`;
      let asciiBuffer = '';

      this.logger.log(`Cliente TCP conectado: ${remote}`);

      socket.on('data', async (chunk: Buffer) => {
        try {
          const asAscii = chunk.toString('ascii');

          if (asAscii.includes('*HQ,')) {
            asciiBuffer += asAscii;

            while (asciiBuffer.includes('#')) {
              const endIndex = asciiBuffer.indexOf('#');
              const fullMessage = asciiBuffer.slice(0, endIndex + 1);
              asciiBuffer = asciiBuffer.slice(endIndex + 1);

              this.logger.debug(`ASCII recibido: ${fullMessage}`);

              const parsed = this.gpsParserService.parseAsciiMessage(fullMessage);
              if (parsed) {
                await this.gpsService.handleParsedLocation(parsed);
              } else {
                this.logger.warn(`No se pudo parsear mensaje ASCII: ${fullMessage}`);
              }
            }
          } else {
            this.logger.debug(`Binario recibido. bytes=${chunk.length}`);
            const parsed = this.gpsParserService.parseBinaryMessage(chunk);
            if (parsed) {
              await this.gpsService.handleParsedLocation(parsed);
            }
          }
        } catch (error: any) {
          this.logger.error(`Error procesando chunk TCP: ${error.message}`);
        }
      });

      socket.on('error', (error) => {
        this.logger.error(`Socket error ${remote}: ${error.message}`);
      });

      socket.on('close', () => {
        this.logger.log(`Cliente TCP desconectado: ${remote}`);
      });
    });

    this.server.listen(port, '0.0.0.0', () => {
      this.logger.log(`Servidor TCP GPS escuchando en puerto ${port}`);
    });

    this.server.on('error', (error) => {
      this.logger.error(`Error en servidor TCP: ${error.message}`);
    });
  }

  onModuleDestroy() {
    if (this.server) {
      this.server.close(() => {
        this.logger.log('Servidor TCP GPS detenido');
      });
    }
  }
}