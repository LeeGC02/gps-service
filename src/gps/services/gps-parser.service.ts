import { Injectable, Logger } from '@nestjs/common';
import { ParsedGpsLocation } from '../interfaces/parsed-gps-location.interface';
import { St901Decoder } from '../decoders/st901.decoder';
import { Gt06Decoder } from '../decoders/gt06.decoder';

@Injectable()
export class GpsParserService {
  private readonly logger = new Logger(GpsParserService.name);

  parseAsciiMessage(message: string): ParsedGpsLocation | null {
    const parsed = St901Decoder.decode(message);

    if (parsed) {
      return parsed;
    }

    this.logger.warn(`Mensaje ASCII no reconocido: ${message}`);
    return null;
  }

  parseBinaryMessage(buffer: Buffer): ParsedGpsLocation | null {
    const parsed = Gt06Decoder.decode(buffer);

    if (parsed) {
      return parsed;
    }

    this.logger.warn(`Mensaje binario no reconocido. bytes=${buffer.length}`);
    return null;
  }
}