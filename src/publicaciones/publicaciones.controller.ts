import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { Publicacion } from 'src/entities/publicacion.entity';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Get()
  findAll() {
    return this.publicacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.publicacionesService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Publicacion>) {
    return this.publicacionesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Publicacion>) {
    return this.publicacionesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.publicacionesService.remove(id);
  }
}
