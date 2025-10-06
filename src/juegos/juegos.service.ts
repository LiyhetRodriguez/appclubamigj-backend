import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Juego } from 'src/entities/juego.entity';

@Injectable()
export class JuegosService {
  constructor(
    @InjectRepository(Juego)
    private juegosRepository: Repository<Juego>,
  ) {}

  findAll() {
    return this.juegosRepository.find();
  }

  findOne(id: number) {
    return this.juegosRepository.findOne({ where: { id } });
  }

  create(data: Partial<Juego>) {
    const juego = this.juegosRepository.create(data);
    return this.juegosRepository.save(juego);
  }

  update(id: number, data: Partial<Juego>) {
    return this.juegosRepository.update(id, data);
  }

  remove(id: number) {
    return this.juegosRepository.delete(id);
  }
}
