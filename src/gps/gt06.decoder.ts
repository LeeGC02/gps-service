// decodifica los paquetes binarios
export interface GpsData {
  deviceId: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: Date;
}

export function decodeGT06(buffer: Buffer, deviceId: string): GpsData | null {
  try {
    // Verificar header GT06
    if (buffer[0] !== 0x78 || buffer[1] !== 0x78) return null;

    const packetType = buffer[3];

    // Tipo 0x01 = paquete de login
    // Tipo 0x12 = paquete de ubicación GPS
    if (packetType !== 0x12) return null;

    // Decodificar latitud y longitud
    const latRaw = buffer.readUInt32BE(4);
    const lngRaw = buffer.readUInt32BE(8);

    const lat = latRaw / 1800000.0;
    const lng = lngRaw / 1800000.0;
    const speed = buffer[12];

    return {
      deviceId,
      lat,
      lng,
      speed,
      timestamp: new Date(),
    };
  } catch (err) {
    console.error('Error decodificando GT06:', err);
    return null;
  }
}

export function buildLoginResponse(): Buffer {
  // Respuesta de confirmación de login al GPS
  return Buffer.from([0x78, 0x78, 0x05, 0x01, 0x00, 0x01, 0xd9, 0xdc, 0x0d, 0x0a]);
}