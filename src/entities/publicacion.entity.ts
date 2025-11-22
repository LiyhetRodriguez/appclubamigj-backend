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

  // imagenPath puede venir del frontend como 'imagenUrl'. Hacemos la columna opcional
  // para aceptar payloads que no incluyan el campo y evitar errores en inserts rápidos.
  @Column({ name: 'imagen_path', type: 'text', nullable: true })
  imagenPath?: string | null;

  // Relación opcional con el usuario que creó la publicación. Puede ser nula
  // si el payload viene desde el admin sin contexto de usuario.
  @ManyToOne(() => Usuario, (usuario) => usuario.publicaciones, { nullable: true })
  creadoPor?: Usuario | null;

  // Timestamps con valor por defecto en la base de datos para no requerir que el
  // cliente los envíe explícitamente.
  @Column({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creadoEn: Date;

  @Column({ name: 'actualizado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  actualizadoEn: Date;
}
