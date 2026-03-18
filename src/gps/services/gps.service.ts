import { Injectable, Logger } from '@nestjs/common';
import { ParsedGpsLocation } from '../interfaces/parsed-gps-location.interface';
import { GpsGateway } from '../gateway/gps.gateway';

@Injectable()
export class GpsService {
  private readonly logger = new Logger(GpsService.name);
  private readonly latestLocations = new Map<string, ParsedGpsLocation>();

  constructor(private readonly gpsGateway: GpsGateway) {}

  async handleParsedLocation(location: ParsedGpsLocation): Promise<void> {
    this.validateLocation(location);

    this.latestLocations.set(location.deviceId, location);

    this.logger.log(
      `Ubicación válida: ${location.deviceId} | ${location.lat}, ${location.lng} | ${location.protocol}`,
    );

    if ((process.env.ENABLE_WS_EMIT || 'true') === 'true') {
      this.gpsGateway.emitLocation(location);
    }

    // Luego aquí irá la integración con backend real:
    // 1. buscar vehículo por gpsDeviceId
    // 2. guardar trayectoria
    // 3. actualizar última ubicación
    // 4. emitir al gateway real del sistema
  }

  getDeviceIds(): string[] {
    return Array.from(this.latestLocations.keys());
  }

  getLatestLocation(deviceId: string): ParsedGpsLocation | null {
    return this.latestLocations.get(deviceId) || null;
  }

  getStats() {
    return {
      devices: this.latestLocations.size,
      tcpPort: Number(process.env.GPS_TCP_PORT || 5000),
      httpPort: Number(process.env.HTTP_PORT || 3001),
      wsEmit: (process.env.ENABLE_WS_EMIT || 'true') === 'true',
    };
  }

  private validateLocation(location: ParsedGpsLocation): void {
    if (!location.deviceId?.trim()) {
      throw new Error('deviceId vacío');
    }

    if (Number.isNaN(location.lat) || location.lat < -90 || location.lat > 90) {
      throw new Error(`lat inválida: ${location.lat}`);
    }

    if (Number.isNaN(location.lng) || location.lng < -180 || location.lng > 180) {
      throw new Error(`lng inválida: ${location.lng}`);
    }
  }
}