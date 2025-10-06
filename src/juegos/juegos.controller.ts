import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { JuegosService } from './juegos.service';
import { Juego } from 'src/entities/juego.entity';

@Controller('juegos')
export class JuegosController {
  constructor(private readonly juegosService: JuegosService) {}

  @Get()
  findAll() {
    return this.juegosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.juegosService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Juego>) {
    return this.juegosService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Juego>) {
    return this.juegosService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.juegosService.remove(id);
  }
}
