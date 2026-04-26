 import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Aporte } from './aporte.entity';
import { Publicacion } from './publicacion.entity';
import { JuegoUsuario } from './juego-usuario.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_completo', length: 150 })
  nombreCompleto: string;

  @Column({ name: 'tipo_documento', length: 20 })
  tipoDocumento: string;

  @Column({ name: 'numero_documento', length: 30, unique: true })
  numeroDocumento: string;

  @Column({ name: 'fecha_nacimiento', type: 'date' })
  fechaNacimiento: Date;

  @Column({ length: 20, unique: true, nullable: true })
celular!: string;

  @Column({ length: 200 })
  direccion: string;

  @Column({ length: 100 })
  barrio: string;

  @Column({ length: 100 })
  parroquia: string;

  @Column({ length: 120, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

   @Column({ default: 'usuario' }) 
  rol: 'usuario' | 'admin';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creado_en: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  actualizado_en: Date;

  @OneToMany(() => Aporte, (aporte) => aporte.usuario)
  aportes: Aporte[];

  @OneToMany(() => Publicacion, (pub) => pub.creadoPor)
  publicaciones: Publicacion[];

  @OneToMany(() => JuegoUsuario, (ju) => ju.usuario)
  juegosUsuario: JuegoUsuario[];

}
 @Entity()
 export class usuarios{
   @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCompleto: string;

  @Column({ unique: true })
  numeroDocumento: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'usuario' })
  rol: string; // 'admin' | 'usuario'
}