// agrupacion de todo el gps
import { Module } from "@nestjs/common";
import { GpsController } from "./gps.controller";
import { GpsService } from "./gps.services";

@Module({
    controllers: [GpsController],
    providers: [GpsService],
})
export class GpsModule{}