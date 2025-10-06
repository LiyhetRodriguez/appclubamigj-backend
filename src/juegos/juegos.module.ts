import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Juego } from 'src/entities/juego.entity';
import { JuegosController } from './juegos.controller';
import { JuegosService } from './juegos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Juego])],
  controllers: [JuegosController],
  providers: [JuegosService],
  exports: [JuegosService],
})
export class JuegosModule {}
