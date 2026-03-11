// agrupacion de todo el gps
import { Module } from "@nestjs/common";
import { GpsController } from "./gps.controller";
import { GpsService } from "./gps.service";
import { GpsGateway } from "./gps.gateway";
import { TcpServer } from "./tcp.server";

@Module({
    controllers: [GpsController],
    providers: [GpsService, GpsGateway, TcpServer],
})
export class GpsModule{}