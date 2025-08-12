import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    let a = 1;
    a = 2;
    a = 3;
    console.log(a)
    return this.appService.getHello();
  }
}
