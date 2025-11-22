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

  @Column({ name: 'metodo_pago', length: 50, nullable: true })
  metodoPago: string;

  @Column({ name: 'preference_id', length: 120, nullable: true })
  preferenceId?: string;

  @Column({ name: 'payment_id', length: 120, nullable: true })
  paymentId?: string;

  @Column({ name: 'estado', length: 30, default: 'pending' })
  estado: string;

  @Column({ name: 'referencia_pago', length: 100, nullable: true })
  referenciaPago?: string;

  @Column({ name: 'payer_email', length: 150, nullable: true })
  payerEmail?: string;

  @Column({ name: 'payer_name', length: 200, nullable: true })
  payerName?: string;

  @Column({ name: 'pagado_en', type: 'timestamp', nullable: true })
  pagadoEn?: Date;

  @Column({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creadoEn: Date;
}
