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

  // ✅ PAGO SIMULADO COMPLETO
  async createPreference(data: {
    usuarioId: number;
    monto: number;
    descripcion?: string;
  }) {
    const aporte = this.aportesRepository.create({
      monto: data.monto,
      descripcion: data.descripcion || 'Aporte simulado',
      estado: 'approved',
      preferenceId: 'SIMULADO',
      paymentId: 'SIMULADO',
      creadoEn: new Date(),
      pagadoEn: new Date(),
    } as Partial<Aporte>);

    const saved = await this.aportesRepository.save(aporte);

    return {
      ok: true,
      message: 'Pago simulado aprobado correctamente',
      preferenceId: 'SIMULADO',
      init_point: 'https://www.google.com',
      savedAporte: saved,
    };
  }

  // ✅ Webhook simulado
  async handleMercadoPagoNotification(req: any) {
    return {
      ok: true,
      message: 'Webhook simulado recibido',
    };
  }

  update(id: number, data: Partial<Aporte>) {
    return this.aportesRepository.update(id, data);
  }

  remove(id: number) {
    return this.aportesRepository.delete(id);
  }
}