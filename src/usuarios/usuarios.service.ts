import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  findAll() {
    return this.usuariosRepository.find();
  }

  findOne(id: number) {
    return this.usuariosRepository.findOne({ where: { id } });
  }

  create(data: Partial<Usuario>) {
    const usuario = this.usuariosRepository.create(data);
    return this.usuariosRepository.save(usuario);
  }

  update(id: number, data: Partial<Usuario>) {
    return this.usuariosRepository.update(id, data);
  }

  remove(id: number) {
    return this.usuariosRepository.delete(id);
  }
}
