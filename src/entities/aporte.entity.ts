import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('aportes')
export class Aporte {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.aportes)
  usuario: Usuario;

  @Column('numeric', { precision: 12, scale: 2 })
  monto: number;

  @Column({ name: 'metodo_pago', length: 50 })
  metodoPago: string;

  @Column({ length: 30 })
  estado: string;

  @Column({ name: 'referencia_pago', length: 100 })
  referenciaPago: string;

  @Column({ name: 'creado_en', type: 'timestamp' })
  creadoEn: Date;
}
