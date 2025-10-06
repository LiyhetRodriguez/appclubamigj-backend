import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('publicaciones')
export class Publicacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column({ name: 'imagen_path', type: 'text' })
  imagenPath: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.publicaciones)
  creadoPor: Usuario;

  @Column({ name: 'creado_en', type: 'timestamp' })
  creadoEn: Date;

  @Column({ name: 'actualizado_en', type: 'timestamp' })
  actualizadoEn: Date;
}
