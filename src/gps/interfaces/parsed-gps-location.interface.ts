export type GpsProtocol = 'st901' | 'gt06';
export interface ParsedGpsLocation {
  deviceId: string;        // ID del tracker (clave principal)
  lat: number;             // Latitud
  lng: number;             // Longitud
  speed: number | null;    // Velocidad (puede no venir)
  timestamp: Date;         // Fecha/hora del GPS
  protocol: GpsProtocol;   // Qué tipo de dispositivo lo envió
  course?: number | null;  // Dirección (opcional)
  status?: string | null;  // Estado del GPS (opcional)
  raw?: string;            // Mensaje original (para debug)
}