import { CustomApiResponse } from '@/util/api.response';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { QrService } from './qr.service';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get('/generate/:id')
  async generateQr(@Param('id') id: number) {
    const text = `http://localhost:8999/qr/check?id=${id}`;
    // const text = 'Hello world';
    const qrImg = await this.qrService.generateQr(text);
    return CustomApiResponse.getInstance().ok('Generate QRCode', qrImg);
  }

  @Get('/check')
  async checkQr(@Query('id') id: number) {
    console.log(id);

    return CustomApiResponse.getInstance().ok('Check QRCode', id);
  }
}
