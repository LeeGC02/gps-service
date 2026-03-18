import { ParsedGpsLocation } from '../interfaces/parsed-gps-location.interface';
export class St901Decoder {
  // recibe el texto crudo del GPS y devuelve una ubicación ya entendible por el sistema.
  static decode(text: string): ParsedGpsLocation | null {
    try {
      const raw = text.trim();
      // Validamos que realmente parezca un paquete ST-901 ASCII
      // *HQ,4101005306,V1,142043,V,1631.1486,S,6805.1470,W,000.00,000,160326,FFFFFBFF#
      if (!raw.startsWith('*HQ,') || !raw.endsWith('#')) {
        return null;
      }
      const clean = raw.replace(/^\*/, '').replace(/#$/, '');
      const parts = clean.split(',');
      if (parts.length < 12) {
        return null;
      }
      // Validamos que realmente el primer bloque sea HQ
      if (parts[0] !== 'HQ') {
        return null;
      }
      // ID del tracker
      const deviceId = parts[1]?.trim();
      // Hora: 142043 -> 14:20:43
      const rawTime = parts[3]?.trim();
      // Estado:
      // A = fix válido
      // V = sin fix / última ubicación / inválida según configuración
      const status = parts[4]?.trim();
      // Latitud NMEA: 1631.1486
      const rawLat = parts[5]?.trim();
      // Hemisferio latitud: N o S
      const latHem = parts[6]?.trim();
      // Longitud NMEA: 6805.1470
      const rawLng = parts[7]?.trim();
      // Hemisferio longitud: E o W
      const lngHem = parts[8]?.trim();
      // Velocidad
      const speed = parseFloat(parts[9] || '0');
      // Curso o dirección
      const course = parseFloat(parts[10] || '0');
      // Fecha: 160326 -> 16/03/26
      const rawDate = parts[11]?.trim();
      // Validaciones básicas antes de convertir
      if (!deviceId || !rawTime || !rawDate || !rawLat || !rawLng || !latHem || !lngHem) {
        return null;
      }
      // Convertimos coordenadas NMEA a decimal
      const lat = this.nmeaToDecimal(rawLat, latHem);
      const lng = this.nmeaToDecimal(rawLng, lngHem);
      // Convertimos fecha + hora en objeto Date
      const timestamp = this.parseDateTime(rawDate, rawTime);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return null;
      }
      return {
        deviceId,
        lat,
        lng,
        speed: Number.isNaN(speed) ? null : speed,
        timestamp,
        protocol: 'st901',
        course: Number.isNaN(course) ? null : course,
        status: status || null,
        raw,
      };
    } catch (error) {
      console.error('Error decodificando ST-901 ASCII:', error);
      return null;
    }
  }
  private static nmeaToDecimal(value: string, hemisphere: string): number {
    const num = parseFloat(value);

    if (Number.isNaN(num)) {
      return NaN;
    }

    const degrees = Math.floor(num / 100);
    const minutes = num - degrees * 100;

    let decimal = degrees + minutes / 60;

    // Si está en hemisferio sur o oeste, va negativo
    if (hemisphere === 'S' || hemisphere === 'W') {
      decimal *= -1;
    }

    return decimal;
  }
  private static parseDateTime(date: string, time: string): Date {
    const dd = date.slice(0, 2);
    const mm = date.slice(2, 4);
    const yy = date.slice(4, 6);

    const hh = time.slice(0, 2);
    const mi = time.slice(2, 4);
    const ss = time.slice(4, 6);

    return new Date(`20${yy}-${mm}-${dd}T${hh}:${mi}:${ss}Z`);
  }
}