// guardar y entrega ubicaciones
import { Injectable } from "@nestjs/common";
import { GpsData } from "./gt06.decoder";

@Injectable()
export class GpsService {
  //guardamos en memoria por ahora, cambio a bd o redis ??
  private locations: Map<string, GpsData> = new Map()

  saveLocation(data: GpsData): void {
    this.locations.set(data.deviceId, data);
    console.log(`📍 GPS ${data.deviceId} → lat: ${data.lat}, lng: ${data.lng}, speed: ${data.speed} km/h`);
  }

  getLocation(deviceId: string): GpsData | null {
    return this.locations.get(deviceId) || null;
  }

  getAllDevices(): GpsData[] {
    return Array.from(this.locations.values());
  }
}
