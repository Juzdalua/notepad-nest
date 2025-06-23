import { Injectable, Logger } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  private logger = new Logger(QrService.name);
  async generateQr(data: string): Promise<string> {
    try {
      const qr = await QRCode.toDataURL(data);
      return qr;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
