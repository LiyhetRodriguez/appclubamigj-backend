import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { JuegoUsuariosService } from './juego-usuarios.service';
import { JuegoUsuario } from 'src/entities/juego-usuario.entity';

@Controller('juego-usuarios')
export class JuegoUsuariosController {
  constructor(private readonly juegoUsuariosService: JuegoUsuariosService) {}

  @Get()
  findAll() {
    return this.juegoUsuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.juegoUsuariosService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<JuegoUsuario>) {
    return this.juegoUsuariosService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<JuegoUsuario>) {
    return this.juegoUsuariosService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.juegoUsuariosService.remove(id);
  }
}
