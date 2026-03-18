import { Controller, Get, Param } from '@nestjs/common';
import { GpsService } from '../services/gps.service';

@Controller('gps')
export class GpsController {
  constructor(private readonly gpsService: GpsService) {}

  @Get('health')
  health() {
    return {
      ok: true,
      service: 'gps-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('stats')
  stats() {
    return this.gpsService.getStats();
  }

  @Get('devices')
  devices() {
    return this.gpsService.getDeviceIds();
  }

  @Get('location/:deviceId')
  getLocation(@Param('deviceId') deviceId: string) {
    return this.gpsService.getLatestLocation(deviceId);
  }
}