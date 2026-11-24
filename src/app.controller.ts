import { BadGatewayException, Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { Response } from 'express';
import { createReadStream } from 'fs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  async getHello(str: string): Promise<any> {
    throw new BadGatewayException();
    return 'hello';
  }

  @Get('download')
  download(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="result.zip"');

    createReadStream('/tmp/result.zip').pipe(res);
  }
}
