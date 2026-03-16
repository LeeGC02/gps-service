export interface GpsData {
  deviceId: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: Date;
  status?: string;
  course?: number;
  raw?: string;
}

export function decodeST901Ascii(text: string): GpsData | null {
  try {
    const clean = text.trim().replace(/^\*/, '').replace(/#$/, '');
    const parts = clean.split(',');

    if (parts.length < 12) return null;
    if (parts[0] !== 'HQ') return null;

    const deviceId = parts[1];
    const rawTime = parts[3];   // 142043
    const status = parts[4];    // V o A
    const rawLat = parts[5];    // 1631.1486
    const latHem = parts[6];    // S
    const rawLng = parts[7];    // 6805.1470
    const lngHem = parts[8];    // W
    const speed = parseFloat(parts[9] || '0');
    const course = parseFloat(parts[10] || '0');
    const rawDate = parts[11];  // 160326

    const lat = nmeaToDecimal(rawLat, latHem);
    const lng = nmeaToDecimal(rawLng, lngHem);
    const timestamp = parseDateTime(rawDate, rawTime);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    return {
      deviceId,
      lat,
      lng,
      speed,
      course,
      status,
      timestamp,
      raw: text,
    };
  } catch (err) {
    console.error('Error decodificando ST-901 ASCII:', err);
    return null;
  }
}

function nmeaToDecimal(value: string, hemisphere: string): number {
  const num = parseFloat(value);
  if (Number.isNaN(num)) return NaN;

  const degrees = Math.floor(num / 100);
  const minutes = num - degrees * 100;
  let decimal = degrees + minutes / 60;

  if (hemisphere === 'S' || hemisphere === 'W') {
    decimal *= -1;
  }

  return decimal;
}

function parseDateTime(date: string, time: string): Date {
  const dd = date.slice(0, 2);
  const mm = date.slice(2, 4);
  const yy = date.slice(4, 6);

  const hh = time.slice(0, 2);
  const mi = time.slice(2, 4);
  const ss = time.slice(4, 6);

  return new Date(`20${yy}-${mm}-${dd}T${hh}:${mi}:${ss}Z`);
}