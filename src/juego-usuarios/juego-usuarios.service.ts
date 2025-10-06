import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JuegoUsuario } from 'src/entities/juego-usuario.entity';

@Injectable()
export class JuegoUsuariosService {
  constructor(
    @InjectRepository(JuegoUsuario)
    private juegoUsuariosRepository: Repository<JuegoUsuario>,
  ) {}

  findAll() {
    return this.juegoUsuariosRepository.find();
  }

  findOne(id: number) {
    return this.juegoUsuariosRepository.findOne({ where: { id } });
  }

  create(data: Partial<JuegoUsuario>) {
    const juegoUsuario = this.juegoUsuariosRepository.create(data);
    return this.juegoUsuariosRepository.save(juegoUsuario);
  }

  update(id: number, data: Partial<JuegoUsuario>) {
    return this.juegoUsuariosRepository.update(id, data);
  }

  remove(id: number) {
    return this.juegoUsuariosRepository.delete(id);
  }
}
