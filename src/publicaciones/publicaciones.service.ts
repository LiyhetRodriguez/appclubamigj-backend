import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publicacion } from 'src/entities/publicacion.entity';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectRepository(Publicacion)
    private publicacionesRepository: Repository<Publicacion>,
  ) {}

  findAll() {
    return this.publicacionesRepository.find();
  }

  findOne(id: number) {
    return this.publicacionesRepository.findOne({ where: { id } });
  }

  create(data: Partial<Publicacion>) {
    const publicacion = this.publicacionesRepository.create(data);
    return this.publicacionesRepository.save(publicacion);
  }

  update(id: number, data: Partial<Publicacion>) {
    return this.publicacionesRepository.update(id, data);
  }

  remove(id: number) {
    return this.publicacionesRepository.delete(id);
  }
}
