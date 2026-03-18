import { Module } from '@nestjs/common';
import { GpsController } from './controller/gps.controller';
import { GpsGateway } from './gateway/gps.gateway';
import { GpsService } from './services/gps.service';
import { GpsParserService } from './services/gps-parser.service';
import { GpsTcpServer } from './services/gps-tcp.server';

@Module({
  controllers: [GpsController],
  providers: [GpsGateway, GpsService, GpsParserService, GpsTcpServer],
})
export class GpsModule {}