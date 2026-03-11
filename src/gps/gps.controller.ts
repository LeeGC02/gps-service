// enpoints REST
import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { GpsService } from "./gps.service";

@Controller('gps')
export class GpsController {
  constructor(private readonly gpsService: GpsService) {}
  // GET /gps/devices → todos los dispositivos conectados
  @Get('devices')
  getAllDevices() {
    return this.gpsService.getAllDevices();
  }
  // GET /gps/location/:devideId -> ultima ubicacion de un gps
  @Get('location/:deviceId')
  getLocation(@Param('deviceId') deviceId:string){
    const location = this.gpsService.getLocation(deviceId);
    if(!location) {
        throw new NotFoundException(`GPS ${deviceId} no encontrado`);
    }
    return location;
  }
}