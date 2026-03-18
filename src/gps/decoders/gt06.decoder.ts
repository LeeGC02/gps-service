import { ParsedGpsLocation } from '../interfaces/parsed-gps-location.interface';

export class Gt06Decoder {
  static decode(buffer: Buffer): ParsedGpsLocation | null {
    try {
      if (!buffer || buffer.length < 5) {
        return null;
      }

      // Aquí debes reutilizar tu lógica real GT06
      // Este archivo queda como adaptador al formato unificado

      return null;
    } catch {
      return null;
    }
  }
}