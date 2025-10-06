import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JuegoUsuario } from '../entities/juego-usuario.entity';
import { JuegoUsuariosController } from './juego-usuarios.controller';
import { JuegoUsuariosService } from './juego-usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([JuegoUsuario])],
  controllers: [JuegoUsuariosController],
  providers: [JuegoUsuariosService],
  exports: [JuegoUsuariosService],
})
export class JuegoUsuariosModule {}
