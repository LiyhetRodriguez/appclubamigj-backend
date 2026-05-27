import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('links')
  getLinks() {
    return {
      emisora: 'https://tuemisora.com',
      whatsapp: 'https://wa.me/573001234567',
      instagram: 'https://instagram.com/tucuenta',
      tiktok: 'https://tiktok.com/@tucuenta',
      facebook: 'https://facebook.com/tucuenta'
    };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}