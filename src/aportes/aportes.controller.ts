import { Controller, Get, Post, Put, Delete, Param, Body, Req } from '@nestjs/common';
import { AportesService } from './aportes.service';
import { Aporte } from 'src/entities/aporte.entity';

@Controller('aportes')
export class AportesController {
  constructor(private readonly aportesService: AportesService) {}

  @Get()
  findAll() {
    return this.aportesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.aportesService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Aporte>) {
    return this.aportesService.create(data);
  }

  @Post('create-preference')
  async createPreference(@Body() data: { usuarioId: number; monto: number; descripcion?: string }) {
    return this.aportesService.createPreference(data);
  }

  @Post('webhook/mercadopago')
  async mercadopagoWebhook(@Req() req: any) {
    // Raw notification from Mercado Pago (topic/id or resource/collection)
    return this.aportesService.handleMercadoPagoNotification(req);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Aporte>) {
    return this.aportesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.aportesService.remove(id);
  }
}
