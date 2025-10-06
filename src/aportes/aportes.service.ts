import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aporte } from 'src/entities/aporte.entity';

@Injectable()
export class AportesService {
  constructor(
    @InjectRepository(Aporte)
    private aportesRepository: Repository<Aporte>,
  ) {}

  findAll() {
    return this.aportesRepository.find();
  }

  findOne(id: number) {
    return this.aportesRepository.findOne({ where: { id } });
  }

  create(data: Partial<Aporte>) {
    const aporte = this.aportesRepository.create(data);
    return this.aportesRepository.save(aporte);
  }

  update(id: number, data: Partial<Aporte>) {
    return this.aportesRepository.update(id, data);
  }

  remove(id: number) {
    return this.aportesRepository.delete(id);
  }
}
